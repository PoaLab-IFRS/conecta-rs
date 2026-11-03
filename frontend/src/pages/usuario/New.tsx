import { useNavigate } from "react-router-dom"; 
import { useCreateUser } from "../../api/usuario/useCreateUser"; 
import { UserForm } from "../../components/UserForm";

export function UserNew() { const navigate = useNavigate();

const { create, loading, error, clearError } = useCreateUser();

return (
	<UserForm
		title="Novo usuário"
		submitLabel="Cadastrar usuário"
		loading={loading}
		error={error}
		onClearError={clearError}
		onSuccess={() => {
			void navigate("/user");
		}}
		onSubmit={async (input) => {
			const result = await create(input);

			return result.status === "created"
				? { status: "ok" }
				: { status: "error" };
		}}
	/>
);


}