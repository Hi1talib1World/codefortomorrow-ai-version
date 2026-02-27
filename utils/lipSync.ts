
// This is a simplified mapping from characters to viseme names.
// A more advanced system would use phonemes.
const charToVisemeMap: Record<string, string> = {
    'a': 'A', 'e': 'E', 'i': 'I', 'o': 'O', 'u': 'U',
    'b': 'B', 'm': 'M', 'p': 'P',
    'f': 'F', 'v': 'V',
    't': 'T', 'd': 'D',
    'k': 'K', 'g': 'K', 's': 'S', 'z': 'S',
    'r': 'R', 'l': 'R'
};

// Creates a timed queue of visemes from a text string.
export const createTextToVisemeQueue = (text: string) => {
    const queue: { time: number; viseme: string; value: number }[] = [];
    const startTime = performance.now();
    let currentTime = startTime;
    const durationPerChar = 60; // ms per character, average speaking rate

    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        const viseme = charToVisemeMap[char];
        
        if (viseme) {
            // Add viseme start
            queue.push({
                time: currentTime,
                viseme,
                value: 1.0
            });
            // Add viseme end (return to neutral) a bit later
            queue.push({
                time: currentTime + durationPerChar * 0.75,
                viseme,
                value: 0
            });
        }
        currentTime += durationPerChar;
    }

    return queue;
};
