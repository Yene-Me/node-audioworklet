/// <reference types="node" />

import { Worker } from 'worker_threads';

/** Audio API specifier arguments. */
declare const enum RtAudioApi {
	/** Search for a working compiled API. */
	UNSPECIFIED,

	/** The Advanced Linux Sound Architecture API. */
	LINUX_ALSA,

	/** The Linux PulseAudio API. */
	LINUX_PULSE,

	/** The Linux Open Sound System API. */
	LINUX_OSS,

	/** The Jack Low-Latency Audio Server API. */
	UNIX_JACK,

	/** Macintosh OS-X Core Audio API. */
	MACOSX_CORE,

	/** The Microsoft WASAPI API. */
	WINDOWS_WASAPI,

	/** The Steinberg Audio Stream I/O API. */
	WINDOWS_ASIO,

	/** The Microsoft DirectSound API. */
	WINDOWS_DS,

	/** A compilable but non-functional API. */
	RTAUDIO_DUMMY
}

/** The format of the PCM data. */
declare const enum RtAudioFormat {
	/** 8-bit signed integer. */
	RTAUDIO_SINT8 = 0x1,

	/** 16-bit signed integer. */
	RTAUDIO_SINT16 = 0x2,

	/** 24-bit signed integer - Removed. */
	RTAUDIO_SINT24 = 0x4,

	/** 32-bit signed integer. */
	RTAUDIO_SINT32 = 0x8,

	/** Normalized between plus/minus 1.0. */
	RTAUDIO_FLOAT32 = 0x10,

	/** Normalized between plus/minus 1.0. */
	RTAUDIO_FLOAT64 = 0x20
}

/** Flags that change the default stream behavior */
declare const enum RtAudioStreamFlags {
	/** Use non-interleaved buffers (default = interleaved). */
	RTAUDIO_NONINTERLEAVED = 0x1,

	/** Attempt to set stream parameters for lowest possible latency. */
	RTAUDIO_MINIMIZE_LATENCY = 0x2,

	/** Attempt grab device and prevent use by others. */
	RTAUDIO_HOG_DEVICE = 0x4,

	/** Try to select realtime scheduling for callback thread. */
	RTAUDIO_SCHEDULE_REALTIME = 0x8,

	/** Use the "default" PCM device (ALSA only). */
	RTAUDIO_ALSA_USE_DEFAULT = 0x10,

	/** Do not automatically connect ports (JACK only). */
	RTAUDIO_JACK_DONT_CONNECT = 0x20
}

/** The public device information structure for returning queried values. */
declare interface RtAudioDeviceInfo {
	/** Character string device identifier. */
	name: string;

	/** Maximum output channels supported by device. */
	outputChannels: number;

	/** Maximum input channels supported by device. */
	inputChannels: number;

	/** Maximum simultaneous input/output channels supported by device. */
	duplexChannels: number;

	/** Is the device the default output device */
	isDefaultOutput: number;

	/** Is the device the default input device */
	isDefaultInput: number;

	/** Supported sample rates (queried from list of standard rates). */
	sampleRates: Array<number>;

	/** Preferred sample rate, e.g. for WASAPI the system sample rate. */
	preferredSampleRate: number;

	/** Bit mask of supported data formats. */
	nativeFormats: number;
}

/** The structure for specifying input or ouput stream parameters. */
declare interface RtAudioStreamParameters {
	/** Device index. */
	deviceId?: number;

	/** Number of channels. */
	nChannels: number;

	/** First channel index on device (default = 0). */
	firstChannel?: number;
}

/** RtAudio provides a common API (Application Programming Interface)
    for realtime audio input/output across Linux (native ALSA, Jack,
    and OSS), Macintosh OS X (CoreAudio and Jack), and Windows
    (DirectSound, ASIO and WASAPI) operating systems. */
export declare class RtAudio {
	/** The volume of the output device. This should be a number between 0 and 1. */
	public outputVolume: number;

	/**
	 * Create an RtAudio instance.
	 * @param api The audio API to use. (Default will be automatically selected)
	 */
	constructor(api?: RtAudioApi);

	/**
	 * A public function for opening a stream with the specified parameters.
	 * @param outputParameters Specifies output stream parameters to use when opening a stream. For input-only streams, this argument should be null.
	 * @param inputParameters Specifies input stream parameters to use when opening a stream. For output-only streams, this argument should be null.
	 * @param format An RtAudio.Format specifying the desired sample data format.
	 * @param sampleRate The desired sample rate (sample frames per second).
	 * @param frameSize The amount of samples per frame.
	 * @param streamName A stream name (currently used only in Jack).
	 * @param processFrameCallback A callback that is called for each frame of frameSize sample with two arguments, inputData and outputData
	 * @param flags A bit-mask of stream flags (RtAudio.StreamFlags).
	 */
	openStream(
		outputParameters: RtAudioStreamParameters | null,
		inputParameters: RtAudioStreamParameters | null,
		format: RtAudioFormat,
		sampleRate: number,
		frameSize: number,
		streamName: string,
		processFrameCallback?: ((inputData: Buffer[], outputData: Buffer[]) => void),
		flags?: RtAudioStreamFlags
	): void;

	/**
	 * A function that closes a stream and frees any associated stream memory.
	 */
	closeStream(): void;

	/**
	 * Returns true if a stream is open and false if not.
	 */
	isStreamOpen(): boolean;

	/**
	 * Start the stream.
	 */
	start(): void;

	/**
	 * Stop the stream.
	 */
	stop(): void;

	/**
	 * Returns true if the stream is running and false if it is stopped or not open.
	 */
	isStreamRunning(): boolean;

	/**
	 * Returns the full display name of the current used API.
	 */
	getApi(): string;

	/**
	 * Returns the internal stream latency in sample frames.
	 */
	getStreamLatency(): number;

	/**
	 * Returns actual sample rate in use by the stream.
	 */
	getStreamSampleRate(): number;

	/**
	 * Returns the list of available devices.
	 */
	getDevices(): Array<RtAudioDeviceInfo>;

	/**
	 * Returns the index of the default input device.
	 */
	getDefaultInputDevice(): number;

	/**
	 * Returns the index of the default output device.
	 */
	getDefaultOutputDevice(): number;

	setProcessFunction(process: (inputData: Buffer[], outputData: Buffer[]) => boolean): void;

	/**
	 * Start the module specified by scriptPath in a new worker thread and use it as the process function
	 * The module should export a class extending AudioWorkletProcessor with the process method implemented
	 */
	attachProcessFunctionFromWorker(scriptPath: string): Worker;
}

export declare abstract class AudioWorkletProcessor {
	constructor();

	port: MessagePort;
	abstract process(inputData: Buffer[], outputData: Buffer[]): boolean;
}
