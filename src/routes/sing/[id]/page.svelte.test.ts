import { describe, test, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Page from "./+page.svelte";
import { SUBTITLE_SAMPLES } from "./constants";
import type { SongDifficulty } from "$lib/types/difficulty";

// Mock the SVG imports
vi.mock("./icons/eye.svg?raw", () => ({
	default: "<svg>eye</svg>"
}));
vi.mock("./icons/eye-off.svg?raw", () => ({
	default: "<svg>eye-off</svg>"
}));

// Mock data for testing
const mockPageData = {
	id: "song_123",
	lyrics: "Line 1\nLine 2\nLine 3\nLine 4\nLine 5",
	difficulty: "medium" as SongDifficulty,
	created_at: new Date()
};

// Create a mock scrollTo function
const mockScrollTo = vi.fn();

// Helper function to check if an element's innerHTML contains the word "blur"
const hasBlurInInnerHTML = (element: HTMLElement): boolean => {
	return element.innerHTML.includes("blur");
};

describe("Sing page component", () => {
	beforeEach(() => {
		// Reset mocks between tests
		vi.clearAllMocks();
		mockScrollTo.mockClear();
	});

	test("should render the component with song data", () => {
		render(Page, { data: mockPageData });

		// Check if main elements are rendered
		expect(screen.getByTestId("sing-page")).toBeInTheDocument();
		expect(screen.getByTestId("song-title")).toBeInTheDocument();
		expect(screen.getByTestId("song-subtitle")).toBeInTheDocument();
		expect(screen.getByTestId("lyrics-container")).toBeInTheDocument();
		expect(screen.getByTestId("lyrics-scroll-container")).toBeInTheDocument();
		expect(screen.getByTestId("controls-container")).toBeInTheDocument();
		expect(screen.getByTestId("instructions")).toBeInTheDocument();
		expect(screen.getByTestId("reset-button")).toBeInTheDocument();
		expect(screen.getByTestId("toggle-blur-button")).toBeInTheDocument();

		// Check if song title contains the song number
		expect(screen.getByTestId("song-title")).toHaveTextContent("Secret song #123");

		// Check if subtitle is one of the sample subtitles
		const subtitle = screen.getByTestId("song-subtitle").textContent;
		expect(SUBTITLE_SAMPLES).toContain(subtitle);

		// Check if lyrics lines are rendered
		const lyricsLines = mockPageData.lyrics.split("\n");
		lyricsLines.forEach((_, index) => {
			expect(screen.getByTestId(`lyrics-line-${index}`)).toBeInTheDocument();
		});
	});

	test("should toggle blur state when toggle button is clicked", async () => {
		render(Page, { data: mockPageData });

		// Initially, blur should be off
		const lyricsContainer = screen.getByTestId("lyrics-container");
		expect(lyricsContainer).not.toHaveClass("blur-md");

		// Click the toggle button
		const toggleButton = screen.getByTestId("toggle-blur-button");
		await fireEvent.click(toggleButton);

		// Now blur should be on
		expect(lyricsContainer).toHaveClass("blur-md");

		// Controls should be hidden when blurred
		expect(screen.queryByTestId("controls-container")).not.toBeInTheDocument();

		// Click again to toggle back
		await fireEvent.click(toggleButton);

		// Blur should be off again
		expect(lyricsContainer).not.toHaveClass("blur-md");

		// Controls should be visible again
		expect(screen.getByTestId("controls-container")).toBeInTheDocument();
	});

	test("should advance lyrics when space key is pressed", async () => {
		render(Page, { data: mockPageData });

		// Get the lyrics scroll container and add the mock scrollTo function
		const lyricsScrollContainer = screen.getByTestId("lyrics-scroll-container");
		lyricsScrollContainer.scrollTo = mockScrollTo;

		// Initially, first line should be highlighted
		const firstLine = screen.getByTestId("lyrics-line-0");
		expect(firstLine).toHaveClass("text-4xl");
		expect(firstLine).toHaveClass("opacity-100");

		// Simulate space key press
		await fireEvent.keyDown(window, { code: "Space" });

		// Check if scrollTo was called
		expect(mockScrollTo).toHaveBeenCalled();

		// Now second line should be highlighted
		const secondLine = screen.getByTestId("lyrics-line-1");
		expect(secondLine).toHaveClass("text-4xl");
		expect(secondLine).toHaveClass("opacity-100");

		// First line should be less prominent
		expect(firstLine).toHaveClass("text-2xl");
		expect(firstLine).toHaveClass("opacity-50");
	});

	test("should reset lyrics when reset button is clicked", async () => {
		render(Page, { data: mockPageData });

		// Get the lyrics scroll container and add the mock scrollTo function
		const lyricsScrollContainer = screen.getByTestId("lyrics-scroll-container");
		lyricsScrollContainer.scrollTo = mockScrollTo;

		// Advance lyrics a few lines
		for (let i = 0; i < 3; i++) {
			await fireEvent.keyDown(window, { code: "Space" });
		}

		// Fourth line should be highlighted
		const fourthLine = screen.getByTestId("lyrics-line-3");
		expect(fourthLine).toHaveClass("text-4xl");
		expect(fourthLine).toHaveClass("opacity-100");

		// Click reset button
		const resetButton = screen.getByTestId("reset-button");
		await fireEvent.click(resetButton);

		// Check if scrollTo was called
		expect(mockScrollTo).toHaveBeenCalled();

		// First line should be highlighted again
		const firstLine = screen.getByTestId("lyrics-line-0");
		expect(firstLine).toHaveClass("text-4xl");
		expect(firstLine).toHaveClass("opacity-100");

		// Fourth line should be less prominent
		expect(fourthLine).toHaveClass("text-2xl");
		expect(fourthLine).toHaveClass("opacity-50");
	});

	test("should blur lines based on current line index", async () => {
		render(Page, { data: mockPageData });

		// Get the lyrics scroll container and add the mock scrollTo function
		const lyricsScrollContainer = screen.getByTestId("lyrics-scroll-container");
		lyricsScrollContainer.scrollTo = mockScrollTo;

		// Initially, first line should be highlighted and blurred
		const firstLine = screen.getByTestId("lyrics-line-0");
		expect(firstLine).toHaveClass("text-4xl");
		expect(firstLine).toHaveClass("opacity-100");

		// Check that the first line has blur in its innerHTML
		expect(hasBlurInInnerHTML(firstLine)).toBe(true);

		// Advance to the second line
		await fireEvent.keyDown(window, { code: "Space" });

		// First line should now be unblurred
		expect(hasBlurInInnerHTML(firstLine)).toBe(false);

		// Second line should be highlighted and blurred
		const secondLine = screen.getByTestId("lyrics-line-1");
		expect(secondLine).toHaveClass("text-4xl");
		expect(secondLine).toHaveClass("opacity-100");
		expect(hasBlurInInnerHTML(secondLine)).toBe(true);

		// Advance to the third line
		await fireEvent.keyDown(window, { code: "Space" });

		// First and second lines should be unblurred
		expect(hasBlurInInnerHTML(firstLine)).toBe(false);
		expect(hasBlurInInnerHTML(secondLine)).toBe(false);

		// Third line should be highlighted and blurred
		const thirdLine = screen.getByTestId("lyrics-line-2");
		expect(thirdLine).toHaveClass("text-4xl");
		expect(thirdLine).toHaveClass("opacity-100");
		expect(hasBlurInInnerHTML(thirdLine)).toBe(true);
	});
});
