const RtAudioApi = {
	UNSPECIFIED: 0,
	LINUX_ALSA: 1,
	LINUX_PULSE: 2,
	LINUX_OSS: 3,
	UNIX_JACK: 4,
	MACOSX_CORE: 5,
	WINDOWS_WASAPI: 6,
	WINDOWS_ASIO: 7,
	WINDOWS_DS: 8,
	RTAUDIO_DUMMY: 9
};

const RtAudioFormat = {
	RTAUDIO_SINT8: 0x1,
	RTAUDIO_SINT16: 0x2,
	RTAUDIO_SINT24: 0x4,
	RTAUDIO_SINT32: 0x8,
	RTAUDIO_FLOAT32: 0x10,
	RTAUDIO_FLOAT64: 0x20
};

const RtAudioStreamFlags = {
	RTAUDIO_NONINTERLEAVED: 0x1,
	RTAUDIO_MINIMIZE_LATENCY: 0x2,
	RTAUDIO_HOG_DEVICE: 0x4,
	RTAUDIO_SCHEDULE_REALTIME: 0x8,
	RTAUDIO_ALSA_USE_DEFAULT: 0x10,
	RTAUDIO_JACK_DONT_CONNECT: 0x20
};

if (process.browser) {
	exports = module.exports = {
		RtAudioApi,
		RtAudioFormat,
		RtAudioStreamFlags
	};
} else {
	const rawAudioWorklet = require("bindings")("audioworklet");

	exports = module.exports = {
		...rawAudioWorklet,
		RtAudioApi,
		RtAudioFormat,
		RtAudioStreamFlags
	};
}

