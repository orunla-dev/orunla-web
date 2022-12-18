/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";

export function fetchProfile(uid) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("uid", uid);
    if (error) reject(error);
    resolve(data);
  });
}

export function updateProfile(uid, payload) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...payload })
      .eq("uid", uid)
      .select("*");
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchNotification(uid) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("notifications")
      .select()
      .eq("profiles_id", uid);
    if (error) reject(error);
    resolve(data);
  });
}

export function checkUsername(username) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username);
    if (error) reject(error);
    resolve(data);
  });
}

export function loadUserReadHistory(uid) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("now_reading")
      .select(`*, books(*, authors(*, profiles(*)))`)
      .match({ profiles_id: uid, completed: true });
    if (error) reject(error);
    resolve(data);
  });
}

export function loadFromUserHistory(uid, isbn) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("now_reading")
      .select(`*, books(*, authors(*, profiles(*)))`)
      .match({ profiles_id: uid, books_id: isbn });
    if (error) reject(error);
    resolve(data);
  });
}
