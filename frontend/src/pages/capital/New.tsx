import { useNavigate } from "react-router-dom";
import { useCreateCapital } from "../../api/capital/useCreateCapital";
import { CapitalForm } from "../../components/CapitalForm";

export function CapitalNew() {
	const navigate = useNavigate();
	const { create, loading, error, clearError } = useCreateCapital();

	return (
		<CapitalForm
			title="Novo item de capital"
			submitLabel="Cadastrar item"
			loading={loading}
			error={error}
			onClearError={clearError}
			onSuccess={() => {
				void navigate("/capital");
			}}
			onSubmit={async (input) => {
				const result = await create(input);
				return result.status === "created" ? { status: "ok" } : { status: "error" };
			}}
		/>
	);
}
