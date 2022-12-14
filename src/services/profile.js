/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";
import axios from "axios";

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

export function uploadAvatar(filename, file) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`public/${filename}`, file, { upsert: true });
    if (error) reject(error);
    resolve(data);
  });
}

export function loadAvatar(filename) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filename, 6000);
    if (error) reject(error);
    resolve(data);
  });
}

export function uploadToCloudinary(payload) {
  return axios.post(
    "https://api.cloudinary.com/v1_1/orunla/image/upload",
    payload
  );
}

export function deleteNotification(id) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    if (error) reject(error);
    resolve();
  });
}
