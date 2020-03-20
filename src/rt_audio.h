#pragma once

#include <RtAudio.h>
#include <memory>
#include <napi.h>
#include <queue>
#include <mutex>

class RtAudioWrap : public Napi::ObjectWrap<RtAudioWrap>
{
public:
	static Napi::Object Init(Napi::Env env, Napi::Object exports);
	RtAudioWrap(const Napi::CallbackInfo &info);
	~RtAudioWrap();

	Napi::Value getDevices(const Napi::CallbackInfo &info);
	Napi::Value getDefaultInputDevice(const Napi::CallbackInfo& info);
	Napi::Value getDefaultOutputDevice(const Napi::CallbackInfo& info);

	void openStream(const Napi::CallbackInfo &info);
	void closeStream(const Napi::CallbackInfo &info);
	Napi::Value isStreamOpen(const Napi::CallbackInfo& info);

	void start(const Napi::CallbackInfo &info);
	void stop(const Napi::CallbackInfo &info);
	Napi::Value isStreamRunning(const Napi::CallbackInfo& info);

	Napi::Value getApi(const Napi::CallbackInfo& info);
	Napi::Value getStreamLatency(const Napi::CallbackInfo& info);
	Napi::Value getStreamSampleRate(const Napi::CallbackInfo& info);

	void setProcessFunction(const Napi::CallbackInfo& info);

	friend int rt_callback(void *outputBuffer, void *inputBuffer, unsigned int nFrames,
						   double streamTime, RtAudioStreamStatus status, void *userData);

	Napi::Value _getExternal(const Napi::CallbackInfo& info);
	static void _setProcessFunctionFromExternal(const Napi::CallbackInfo& info);

private:
	inline static Napi::FunctionReference constructor;

	std::shared_ptr<RtAudio> _rtAudio;
	unsigned int _frameSize;
	unsigned int _inputChannels;
	unsigned int _outputChannels;
	unsigned int _sampleSize;
	RtAudioFormat _format;

	std::mutex _processfnMutex;
	Napi::ThreadSafeFunction _processFramefn;

	unsigned int getSampleSizeForFormat(RtAudioFormat format);
};
