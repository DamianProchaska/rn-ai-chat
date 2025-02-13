import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import React from "react";

global.React = React;

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Redirect href="/(tabs)/chat" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
