import { useAtributoValores } from "../api/atributo/useAtributoValores";
import { Autocomplete } from "./Autocomplete";

type AtributoValorInputProps = {
  atributoId?: number;
  tipoValor: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function AtributoValorInput({
  atributoId,
  tipoValor,
  value,
  disabled,
  onChange,
}: AtributoValorInputProps) {
  const { data: valores } = useAtributoValores(atributoId);

  if (tipoValor === "BOOLEANO") {
    return (
      <select
        className="form-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Selecione</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
    );
  }

  const options = valores.map((item) => ({
    id: item,
    label: item,
  }));

  return (
    <Autocomplete
      value={value}
      options={options}
      placeholder={disabled ? "Selecione o tipo" : "Buscar ou informar valor"}
      disabled={disabled}
      onChange={onChange}
      onSelect={(option) => {
        if (option) {
          onChange(option.label);
        }
      }}
    />
  );
}
