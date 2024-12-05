import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContextProvider } from "@/lib/hooks/use-user";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingPage from '@/components/ui/loading-page';
import useSWR from 'swr';

const AuthGuard = () => {
	const { data, error, isLoading } = useSWR("/user")

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    console.error("Error while authenticating", error);
  }

	if (data["detail"] === 'User not authenticated') {
		// If user is not authenticated, redirects to login page.
		return <Navigate to="/login" replace />;
	}
  
  // TODO: Review if user registration is not completed

	return <UserContextProvider value={{ name: "" }}>
          <Outlet />
        </UserContextProvider>
};

export default AuthGuard;