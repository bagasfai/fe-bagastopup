"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { ApiError } from "@workspace/api-client/client"
import { useLogin } from "@workspace/api-client/hooks/use-auth"
import { useAuthStore } from "@workspace/api-client/auth-store"
import { useAuthHydrated } from "@workspace/api-client/use-auth-hydrated"
import { Brand } from "@/components/layout/brand"

const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const hasHydrated = useAuthHydrated()
  const token = useAuthStore((state) => state.token)
  const login = useLogin()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  // Already have a session (e.g. hit /login directly while logged in) —
  // bounce straight to the dashboard instead of showing the form.
  useEffect(() => {
    if (hasHydrated && token) {
      router.replace("/")
    }
  }, [hasHydrated, token, router])

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        router.push("/")
      },
      onError: (error: unknown) => {
        // Deliberately generic: the backend already collapses "no such
        // email" and "wrong password" into the same message, so there's
        // nothing field-specific to surface here.
        toast.error("Login failed", {
          description:
            error instanceof ApiError ? error.message : "Something went wrong.",
        })
      },
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Brand />
          <CardTitle className="mt-2">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your admin credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@bagastopup.com"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                  <FieldError errors={[form.formState.errors.password]} />
                </FieldContent>
              </Field>
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending && <Loader2Icon className="animate-spin" />}
                Sign in
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
