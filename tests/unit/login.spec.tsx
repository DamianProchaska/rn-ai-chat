import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "../../app/(auth)/login";
import { useAuthStore } from "../../store/useAuthStore";

jest.mock("../../store/useAuthStore");

describe("LoginScreen", () => {
    it("renders correctly", () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);
        expect(getByText("Zaloguj się")).toBeTruthy();
        expect(getByPlaceholderText("Email")).toBeTruthy();
        expect(getByPlaceholderText("Hasło")).toBeTruthy();
    });

    it("calls login function on press", () => {
        const mockedLogin = jest.fn().mockResolvedValue(true);
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            login: mockedLogin,
        });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
        fireEvent.changeText(getByPlaceholderText("Hasło"), "password123");
        fireEvent.press(getByText("Zaloguj"));

        expect(mockedLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
});
