import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import SetupLyrics from "./index.svelte";
import { DIFFICULTY_MODIFIERS } from "$lib/constants/difficulty";

describe("SetupLyrics component", () => {
	test("should render the component with default values", () => {
		render(SetupLyrics);

		// Check if main headings are rendered using test IDs
		expect(screen.getByTestId("lyrics-heading")).toBeInTheDocument();
		expect(screen.getByTestId("difficulty-heading")).toBeInTheDocument();
		expect(screen.getByTestId("start-heading")).toBeInTheDocument();

		// Check if textarea is rendered with default lyrics
		const textarea = screen.getByTestId("lyrics-textarea") as HTMLTextAreaElement;
		expect(textarea).toBeInTheDocument();
		expect(textarea.value).toContain("Is this the real life?");

		// Check if difficulty buttons are rendered
		const difficultyButtonsContainer = screen.getByTestId("difficulty-buttons");
		expect(difficultyButtonsContainer).toBeInTheDocument();

		Object.values(DIFFICULTY_MODIFIERS).forEach(({ type }) => {
			expect(screen.getByTestId(`difficulty-button-${type}`)).toBeInTheDocument();
		});

		// Check if start button is rendered
		expect(screen.getByTestId("start-button")).toBeInTheDocument();
	});

	test("should update difficulty when a difficulty button is clicked", async () => {
		render(SetupLyrics);

		// Get all difficulty buttons using test IDs
		const difficultyButtons = Object.values(DIFFICULTY_MODIFIERS).map(({ type }) =>
			screen.getByTestId(`difficulty-button-${type}`)
		);

		// Click each button and check if it becomes active
		for (let i = 0; i < difficultyButtons.length; i++) {
			const button = difficultyButtons[i];
			await fireEvent.click(button);

			// Check if the button has the active class
			expect(button).toHaveClass("btn-active");

			// Check if other buttons don't have the active class
			difficultyButtons.forEach((otherButton, index) => {
				if (index !== i) {
					expect(otherButton).not.toHaveClass("btn-active");
				}
			});
		}
	});

	test("should update lyrics when textarea is changed", async () => {
		render(SetupLyrics);

		const textarea = screen.getByTestId("lyrics-textarea") as HTMLTextAreaElement;
		const newLyrics = "New test lyrics\nWith multiple lines";

		// Change the textarea value
		await fireEvent.input(textarea, { target: { value: newLyrics } });

		// Check if the textarea value is updated
		expect(textarea.value).toBe(newLyrics);
	});

	test("should have correct initial form data", () => {
		render(SetupLyrics);

		// Get the form
		const form = screen.getByTestId("setup-lyrics-form");

		// Check if the hidden inputs have the correct values
		const lyricsInput = form.querySelector("input[name='lyrics']") as HTMLInputElement;
		const difficultyInput = form.querySelector("input[name='difficulty']") as HTMLInputElement;

		expect(lyricsInput.value).toContain("Is this the real life?");
		expect(difficultyInput.value).toBe(DIFFICULTY_MODIFIERS.medium.type);
	});

	test("should update form data when user interacts with form elements", async () => {
		render(SetupLyrics);

		// Get the form and form elements
		const form = screen.getByTestId("setup-lyrics-form");
		const textarea = screen.getByTestId("lyrics-textarea") as HTMLTextAreaElement;
		const hardButton = screen.getByTestId("difficulty-button-hard");

		// Get the hidden inputs
		const lyricsInput = form.querySelector("input[name='lyrics']") as HTMLInputElement;
		const difficultyInput = form.querySelector("input[name='difficulty']") as HTMLInputElement;

		// Initial values
		const initialLyrics = lyricsInput.value;
		const initialDifficulty = difficultyInput.value;

		// Update lyrics
		const newLyrics = "Updated test lyrics\nWith multiple lines";
		await fireEvent.input(textarea, { target: { value: newLyrics } });

		// Update difficulty
		await fireEvent.click(hardButton);

		// Check if the hidden inputs are updated
		expect(lyricsInput.value).not.toBe(initialLyrics);
		expect(lyricsInput.value).toBe(newLyrics);
		expect(difficultyInput.value).not.toBe(initialDifficulty);
		expect(difficultyInput.value).toBe("hard");
	});
});
