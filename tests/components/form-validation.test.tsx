import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.email("Enter a valid email address."),
});

function InviteForm() {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={(event) => void handleSubmit(() => undefined)(event)}>
      <label htmlFor="email">Email</label>
      <Input id="email" {...register("email")} />
      {errors.email ? <p role="alert">{errors.email.message}</p> : null}
      <Button type="submit">Send invite</Button>
    </form>
  );
}

describe("form validation", () => {
  it("shows validation errors from zod schemas", async () => {
    const user = userEvent.setup();

    render(<InviteForm />);

    await user.type(screen.getByLabelText("Email"), "bad-email");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email address.");
  });
});
