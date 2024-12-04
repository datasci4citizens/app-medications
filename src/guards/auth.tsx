import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContextProvider } from "@/lib/hooks/use-user";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingPage from '@/components/ui/loading-page';
import useSWR from 'swr';

const AuthGuard = () => {
	const { data, error, isLoading } = useSWR("/users_authentication")

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    console.error("Error while authenticating", error);
  }
  
	if (JSON. stringify(data) === '{}') {
		// If user is not authenticated, i.e, data returned is empty, redirect to login page.
		return <Navigate to="/login" replace />;
	}

	return <UserContextProvider value={{ name: "" }}>
          <Outlet />
        </UserContextProvider>
};

export default AuthGuard;