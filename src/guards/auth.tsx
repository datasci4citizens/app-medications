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

	// if (data["detail"] === 'User not authenticated') {
  if (data === undefined) {
		// If user is not authenticated, redirects to login page.
		return <Navigate to="/login" replace />;
	}

  console.log("User data", data);

  // If not undefined, then callback must hold a valid user data.

  if (data["emergency_contact_number"] === null) {
    // Since emergency contact phone number is the last field that user must fill 
    // in order to finish registration, having it equal to null mean user have not
    // finished registration.
    // TODO: - Please note that this is a poor validation, it should be enhanced in the future.
    return <Navigate to="/registro-paciente" replace />;
  }

	return <UserContextProvider value={{ name: "" }}>
          <Outlet />
        </UserContextProvider>
};

export default AuthGuard;