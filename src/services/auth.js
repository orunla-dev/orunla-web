/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";

export function sendPasswordResetLink(email) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://orunla-staging.web.app/auth/save-password",
      //redirectTo: "localhost:8080/auth/save-password",
    });
    if (error) reject(error);
    resolve(data);
  });
}

export function saveUserPassword(newPassword) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) reject(error);
    resolve(data);
  });
}
