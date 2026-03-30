import { Button } from "../components/common/Button";
import { useAuth } from "../../viewmodel/contexts/AuthContext";

export function Profile() {

  const { logout, user } = useAuth();


  return (
    <div className="min-h-screen bg-graybg pb-20">
      <p className="text-center mt-20 text-gray-400">Perfil em construção</p>
      <Button variant="danger" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}