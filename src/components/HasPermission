import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function HasPermission({ permission, children }) {
  const { hasPermission } = useAuth();
  const allowed = hasPermission(permission);

  return <>{allowed ? children : null}</>;

}
