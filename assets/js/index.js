/**
 * Represents the index.js file for the lyrics-scroll project.
 * This file contains functions for parsing lyrics, creating lyric elements, finding the current lyric index, and setting the offset of the lyrics container.
 */
const doms = {
	audioElement: document.getElementById("song"),
	lyricsUl: document.getElementById("lyrics"),
	container: document.getElementById("container"),
};

/**
 * Parses the lyrics and returns an array of objects containing the time and lyric.
 * @returns {Array} An array of objects containing the time and lyric.
 */
const parseLyrics = () => {
	const splittedByLine = lyrics.trim().split("\n");
	return splittedByLine.map((line) => {
		const parts = line.split("]");
		const timeString = parts[0].substring(1);
		const time = timeString.split(":").reduce((acc, time) => {
			return 60 * +acc + parseFloat(time);
		});
		const lyric = parts[1].trim();
		return { time, lyric };
	});
};

const lrcData = parseLyrics();

/**
 * Creates the lyric elements and appends them to the lyrics container.
 */
const createLyricElements = () => {
	const fragment = document.createDocumentFragment();
	lrcData.forEach((lrc) => {
		const li = document.createElement("li");
		li.textContent = lrc.lyric;
		fragment.appendChild(li);
	});
	doms.lyricsUl.appendChild(fragment);
};

createLyricElements();

const containerHeight = doms.container.clientHeight;
const liHeight = doms.lyricsUl.children[0].clientHeight;

/**
 * Finds the index of the current lyric based on the current time of the audio element.
 * @returns {number} The index of the current lyric.
 */
const findLyricIndex = () => {
	const currentTime = doms.audioElement.currentTime;
	const currentIndex = lrcData.findIndex((lrc, index) => {
		const nextLrc = lrcData[index + 1];
		return currentTime >= lrc.time && (!nextLrc || currentTime < nextLrc.time);
	});
	return currentIndex;
};

const MAX_OFFSET = doms.lyricsUl.clientHeight - containerHeight;

/**
 * Sets the offset of the lyrics container based on the current lyric index.
 */
const setOffset = () => {
	const currentIndex = findLyricIndex();
	if (currentIndex === -1) return;
	let offset = currentIndex * liHeight - containerHeight / 2 + liHeight / 2;
	if (offset > MAX_OFFSET) offset = MAX_OFFSET;
	doms.lyricsUl.style.transform = `translateY(-${offset}px)`;
	document.querySelectorAll("#lyrics li").forEach((li) => {
		li.classList.remove("active");
	});
	doms.lyricsUl.children[currentIndex].classList.add("active");
};

doms.audioElement.addEventListener("timeupdate", setOffset);
