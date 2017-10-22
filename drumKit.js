	var audio_context = window.AudioContext || window.webkitAudioContext;
	var con = new audio_context();
/*	var osc = con.createOscillator();
	osc.frequency.value = 300;
	osc.connect(con.destination)*/

	var nx = Nexus;


	//drum machine code

	var seq = [
	[0, 0, 0, 0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]];

	//creating objects

	var matrix = new Nexus.Add.Sequencer('#drums', {
		'rows': seq.length,
		'columns': seq[0].length
	});

	matrix.colorize('fill', 'grey');

	var tempoDial = new Nexus.Add.Dial('#tempoDial', {
		'min': 80,
		'max': 800,
		'step': 5, 
		'value': 120
	});

	var tempoValue = new Nexus.Add.Number('#tempoValue');
	tempoValue.link(tempoDial);
	var pitchShifters = new Array(8);
	var dl = document.getElementById('shiftersList');
	for(var i = 0; i < 8; i++){
		var dd = document.createElement('dd');
		var div = document.createElement('div');
		var id = 'pitchShifter' + i.toString();
		div.id = id;
		idForNexus = '#' + id;
		dd.appendChild(div);
		dl.appendChild(dd);
		var shifter = new Nexus.Add.Slider(idForNexus, {
			'size': [120, 25],
			'min': 0, 
			'max': 2,
			'step': 0.1,
			'value': 1
		});
		pitchShifters[i] = (shifter);
	}

	console.log(pitchShifters);

	var step = 0;
	var interval = 0.125;

	matrix.on('change', function(tile){
		//console.log(tile);
		seq[tile.row][tile.column] = tile.state;
	})
	var buffers = new Array(8);
	loadSample('odx/001_DX_Snare_1.wav', function (buffer){
    	buffers[0] = buffer; 
	});
	loadSample('odx/012_DX_Cl_Hat.wav', function (buffer){
   		buffers[1] = buffer; 
	});
	loadSample('odx/000_Kick_1.wav', function(buffer){
		buffers[2] = buffer;
	});
	loadSample('odx/005_DX_Open_Hat.wav', function(buffer){
		buffers[3] = buffer;
	});
	loadSample('odx/008_DX_Low_Tom.wav', function(buffer){
		buffers[4] = buffer;
	});
	loadSample('odx/006_DX_Mid_Tom.wav', function(buffer){
		buffers[5] = buffer;
	});
	loadSample('odx/010_DX_Hi_Tom.wav', function(buffer){
		buffers[6] = buffer;
	});
	loadSample('odx/007_DX_Med_Crash.wav', function(buffer){
		buffers[7] = buffer;
	});

	var player;
	var playbackRate = new Array(8);
	playbackRate.fill(1);
	console.log(playbackRate);
	function playSound(buffer, playbackRate){
		player = con.createBufferSource();
		player.buffer = buffer;
		player.loop = false;
		player.playbackRate.value = playbackRate;
		player.connect(con.destination);
		player.start();
	}
	//playSound(closedHat, playbackRate);

	var waitTime = 120;
	var gotUpTo;
	
	function playBeats(step){
		for(var i = 0; i < 8; i++){
			if(seq[i][step % seq[i].length]){
				playSound(buffers[i], playbackRate[i]);
			}
		}
	}

	var counter = new Nexus.Counter(0, 8);
	var interval = new Nexus.Interval(waitTime, function(){
		playBeats(counter.next());
	});


	tempoDial.on('change', function(bpm){
		bps = bpm/60;
		waitTime = 1/bps * 1000;
		interval.ms(waitTime);
	});

	pitchShifters[0].on('change', function(value){
		playbackRate[0] = value;
	})
	pitchShifters[1].on('change', function(value){
		playbackRate[1] = value;
	})
	pitchShifters[2].on('change', function(value){
		playbackRate[2] = value;
	})
	pitchShifters[3].on('change', function(value){
		playbackRate[3] = value;
	})
	pitchShifters[4].on('change', function(value){
		playbackRate[4] = value;
	})
	pitchShifters[5].on('change', function(value){
		playbackRate[5] = value;
	})
	pitchShifters[6].on('change', function(value){
		playbackRate[6] = value;
	})
	pitchShifters[7].on('change', function(value){
		playbackRate[7] = value;
	})


	interval.start();

	function loadSample(url, callback){
	    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function(){
	        var audioData = request.response;
	        con.decodeAudioData(audioData, function(buffer) {
	            //console.log(buffer);
	            callback(buffer);
	        });
	    };
	    request.send();
	};

		/*setInterval(function(){
		var now = con.currentTime;
		var maxFutureTime = now + (waitTime * 1.5);
		if (gotUpTo > now){
			now = gotUpTo;
		}
		while (now <= maxFutureTime){
			step = step + 1;
			if (seq[0][step % seq[0].length]){
				playSound(closedHat, now);
			}
			if (seq[1][step % seq[1].length]){
				playSound(openHat, now);
			}
			if (seq[2][step % seq[2].length]){
				playSound(snare, now);
			}
			if (seq[3][step % seq[3].length]){
				playSound(kick, now);
			}
			now += interval;
		}
		gotUpTo = now;

	}, waitTime*1000);*/
