function mergeArrays(target, source) {
	const targetLen = target.length;
	target.length += source.length;
	for (let i = 0; i < source.length; i++) target[targetLen + i] = source[i];
}

module.exports = {
	mergeArrays,
};
