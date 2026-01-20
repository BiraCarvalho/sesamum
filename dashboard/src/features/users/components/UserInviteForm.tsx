import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Autocomplete } from "@/shared";
import {
  userInviteSchema,
  type UserInviteFormData,
} from "../schemas/userInviteSchema";

const companies = [
  { value: "1", label: "Empresa A" },
  { value: "2", label: "Empresa B" },
  { value: "3", label: "Empresa C" },
];

export const UserInviteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserInviteFormData>({
    resolver: zodResolver(userInviteSchema),
    defaultValues: {
      email: "",
      company: "",
    },
  });

  const onSubmit = (data: UserInviteFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        label="Email"
        placeholder="email@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <Autocomplete
        id="company"
        label="Empresa"
        placeholder="Empresa A"
        options={companies}
        onChange={(value) => setValue("company", value)}
        error={errors.company?.message}
      />
    </form>
  );
};
export default UserInviteForm;
