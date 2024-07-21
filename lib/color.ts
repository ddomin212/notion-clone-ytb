import { createHash } from 'crypto';

function generateRandomColor(seed: string): string {
	// Create a hash from the seed
	const hash = createHash('sha256').update(seed).digest('hex');
	// Convert the first 6 characters of the hash into an integer
	let colorInt = parseInt(hash.substring(0, 6), 16);
	// Ensure the color is light by setting the high bits
	colorInt |= 0x808080;
	// Convert back to a hex string and use the last 6 characters to ensure it's a valid color
	const color = `#${colorInt.toString(16).substr(-6)}`;
	return color;
}

export default generateRandomColor;
