import { FieldErrors, useForm } from "react-hook-form";

// [v] : Have more control over validation.
// [v] : Better Errors (set, clear, display)
// [v] : Have controls over inputs
// [v] : Don't deal with events
// [v] : Easier Inputs

interface LoginForm {
	username: string;
	password: string;
	email: string;
	globalErrors?: string;
}

export default function Forms() {
	const {
		register,
		watch,
		setValue,
		setError,
		handleSubmit,
		reset,
		resetField,
		formState: { errors },
	} = useForm<LoginForm>({
		mode: "onChange",
	});

	const onValid = (data: LoginForm) => {
		console.log("LETSSSSSSSSSSSSSSSSSS FUCKIJNG GO");
		setError("email", { message: "ㅎㅇ" });
		resetField("password");
	};

	const onInvalid = (errors: FieldErrors) => {
		console.log(errors);
	};

	return (
		<form onSubmit={handleSubmit(onValid, onInvalid)}>
			<span>{errors?.globalErrors?.message}</span>
			<input
				{...register("username", {
					required: "pls fill username ma boiii",
					minLength: {
						message: "아쫌",
						value: 3,
					},
				})}
				type="text"
				placeholder="Username"
			/>
			<input
				{...register("email", {
					required: "GIVE ME THE FAQING EMAIL THEN NO ONE GETS HURT",
					validate: {
						notGmail: (value: string) =>
							!value.includes("@gmail.com") || "지메일은 안돼용",
					},
				})}
				type="email"
				placeholder="Email"
			/>
			<span>{errors?.email?.message}</span>

			<input
				{...register("password", {
					required: "YOOOOOOOOOOOOOOOOOOO PASS-WADO",
				})}
				type="password"
				placeholder="Password"
			/>
			<input type="submit" value="Create Account"></input>
			<button
				onClick={() => {
					// setError("globalErrors", {message: "야!!!!!!!!!!!!!!!!!!!!!!!!!"});
					// setValue("username", "hi");
					reset();
				}}
			>
				여기눌러바
			</button>
		</form>
	);
}
