function LiveStream() {
    let _this = this;
    _this.stream = null;
    _this.streaming = false;
    _this.streamingSDK = null;
    _this.streamingSDKConfig = {
        "streamingServer": "https://streaming.live.net",
        "streamingServerPort": 443,
        "streamingServerPath": "/streaming/",
        "streamingServerProtocol": "https:",
        "streamingServerKey": "",
        "streamingServerSecret": "",
        "streamingServerApp": "",
        "streamingServerAppSecret": "",
        "streamingServerAppKey": "",
}
    _this.streamingSDKConfig.streamingServer = _this.streamingSDKConfig.streamingServerProtocol + "//" + _this.streamingSDKConfig.streamingServer + ":" + _this.streamingSDKConfig.streamingServerPort + _this.streamingSDKConfig.streamingServerPath;
    _this.streamingSDKConfig.streamingServerKey = _this.streamingSDKConfig.streamingServerKey.replace(/\s/g, '');
    _this.streamingSDKConfig.streamingServerSecret = _this.streamingSDKConfig.streamingServerSecret.replace(/\s/g, '');

    
}