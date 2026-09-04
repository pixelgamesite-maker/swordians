import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * NOTE ON THE PROVIDER STRING
 * Supabase has historically used "twitter" as the slug for X, and newer
 * versions accept "x". This uses "x" as you specified. If sign-in throws
 * "Unsupported provider", switch the constant below to "twitter" — the
 * rest of the flow is identical either way.
 */
const X_PROVIDER = "x" as const;

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (alive) setSession(s);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}

/** Kicks off the X OAuth redirect. Returns to `redirectPath` when done. */
export async function signInWithX(redirectPath = "/auth/callback") {
  const { error } = await supabase.auth.signInWithOAuth({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: X_PROVIDER as any,
    options: { redirectTo: `${window.location.origin}${redirectPath}` },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/** Pulls a usable display handle out of whatever X returned. */
export function handleFrom(session: Session | null) {
  if (!session) return null;
  const m = session.user.user_metadata ?? {};
  return m.user_name ?? m.preferred_username ?? m.name ?? null;
}
