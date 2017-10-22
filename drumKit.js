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
	var snare, closedHat, kick, openHat, lowTom, midTom, highTom, medCrash;
	loadSample('odx/001_DX_Snare_1.wav', function (buffer){
    	snare = buffer; 
	});
	loadSample('odx/012_DX_Cl_Hat.wav', function (buffer){
   		closedHat = buffer; 
	});
	loadSample('odx/000_Kick_1.wav', function(buffer){
		kick = buffer;
	});
	loadSample('odx/005_DX_Open_Hat.wav', function(buffer){
		openHat = buffer;
	});
	loadSample('odx/008_DX_Low_Tom.wav', function(buffer){
		lowTom = buffer;
	});
	loadSample('odx/006_DX_Mid_Tom.wav', function(buffer){
		midTom = buffer;
	});
	loadSample('odx/010_DX_Hi_Tom.wav', function(buffer){
		highTom = buffer;
	});
	loadSample('odx/007_DX_Med_Crash.wav', function(buffer){
		medCrash = buffer;
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
			if (seq[0][step % seq[0].length]){
				playSound(closedHat, playbackRate[0]);
			}
			if (seq[1][step % seq[1].length]){
				playSound(openHat, playbackRate[1]);
			}
			if (seq[2][step % seq[2].length]){
				playSound(snare, playbackRate[2]);
			}
			if (seq[3][step % seq[3].length]){
				playSound(kick, playbackRate[3]);
			}
			if (seq[4][step % seq[4].length]){
				playSound(lowTom, playbackRate[4]);
			}
			if (seq[5][step % seq[5].length]){
				playSound(midTom, playbackRate[5]);
			}
			if (seq[6][step % seq[6].length]){
				playSound(highTom, playbackRate[6]);
			}
			if (seq[7][step % seq[7].length]){
				playSound(medCrash, playbackRate[7]);
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
