"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-tinta" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-tinta" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="w-full"
        />
      </div>
      {state.error && (
        <p className="text-body-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
