'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import {
  SignInRequest,
  SignInResponse,
  ProfilesResponse,
  SignUpRequest
} from '@/types/profiles';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export function useAuth() {

    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<ProfilesResponse | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const SignOut = () => {
        if (isSigningOut) return;
        setIsSigningOut(true);

        setUser(null);
        queryClient.clear();
        Cookies.remove('auth_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        Cookies.remove('user_info', { path: '/' });
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
        }
        router.push('/sign-in');
    };

    
    const { mutateAsync: SignInWithPassword, isPending: isSignInWithPassword } =
        useMutation({
        mutationKey: ['SignInWithPassword'],
        mutationFn: async (login: SignInRequest) => {
            const response = await axios.post<SignInResponse>(
            `/api/auth/sign_in`,
            login
            );
            return { data: response.data as SignInResponse, password: login.password, email: login.email };
        },
        onSuccess: ({ data, password, email }) => {
            // Set cookie for 7 days with path /
            Cookies.set('auth_token', data.access_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            });

            if (data.refresh_token) {
            Cookies.set('refresh_token', data.refresh_token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
            });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded = jwtDecode<any>(data.access_token);
            const userInfo: ProfilesResponse = {
            id: decoded.sub,
            email: decoded.email ?? null,
            avatar_url:
                decoded.user_metadata?.avatar_url ??
                decoded.user_metadata.avatar ??
                null,
            first_name: decoded.user_metadata?.first_name ?? null,
            last_name: decoded.user_metadata?.last_name ?? null,
            role: decoded.user_metadata?.role ?? null,
            };
            
            Cookies.set('user_info', JSON.stringify(userInfo), {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
            });
            window.location.href = "/dashboard";
            // router.push('/dashboard');
        },
        onError: () => {
            setError(
            "Nous ne reconnaissons pas ces identifiants, vérifiez l'orthographe ou contactez-nous en cas de problème"
            );
        },
        });

    const { mutateAsync: SignUp, isPending: isSignUp } = useMutation({
        mutationKey: ['SignUp'],
        mutationFn: async (sign_up: SignUpRequest) => {
        const response = await axios.post<ProfilesResponse>(
            `/api/auth/sign_up`,
            sign_up
        );
        return {
            profile: response.data as ProfilesResponse,
            email: sign_up.email,
            password: sign_up.password,
        };
        },
        onSuccess: async ({ email, password }) => {
        try {
            const signInResponse = await axios.post<SignInResponse>(`/api/auth/sign_in`, {
                email,
                password,
            });

            const cookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax' as const,
            };

            Cookies.set('auth_token', signInResponse.data.access_token, cookieOptions);

            if (signInResponse.data.refresh_token) {
                Cookies.set('refresh_token', signInResponse.data.refresh_token, cookieOptions);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded = jwtDecode<any>(signInResponse.data.access_token);
            const userInfo: ProfilesResponse = {
                id: decoded.sub,
                email: decoded.email ?? null,
                avatar_url:
                    decoded.user_metadata?.avatar_url ??
                    decoded.user_metadata?.avatar ??
                    null,
                first_name: decoded.user_metadata?.first_name ?? null,
                last_name: decoded.user_metadata?.last_name ?? null,
                role: decoded.user_metadata?.role ?? null,
            };

            Cookies.set('user_info', JSON.stringify(userInfo), cookieOptions);

            window.location.href = '/dashboard';
        } catch {
            router.push('/sign-in');
        }
        },
        onError: (error: unknown) => {
        const axiosError = error as AxiosError<{ detail: string }>;
        if (axiosError.response?.data?.detail === "User already registered") {
            setError("Un compte avec cet email existe déjà. Connectez-vous ou utilisez un autre email.");
        } else {
            setError("Impossible de créer le compte. Vérifiez vos informations et réessayez.");
        }
        },
    });

    return {
        SignInWithPassword,
        isSignInWithPassword,
        SignUp,
        isSignUp,
        error,
        user,
        SignOut,
    };
}