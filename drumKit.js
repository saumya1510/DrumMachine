	var audio_context = window.AudioContext || window.webkitAudioContext;
	var con = new audio_context();
	var osc = con.createOscillator();
	osc.connect(con.destination)

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

	var tempoDial = new Nexus.Add.Dial('#tempoDial', {
		'min': 80,
		'max': 800,
		'step': 5, 
		'value': 120
	});

	var tempoValue = new Nexus.Add.Number('#tempoValue');
	tempoValue.link(tempoDial);

	matrix.colorize('fill', 'grey');

	var step = 0;
	var interval = 0.125;

	matrix.on('change', function(tile){
		console.log(tile);
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
	function playSound(buffer){
		player = con.createBufferSource();
		player.buffer = buffer;
		player.loop = false;
		player.connect(con.destination);
		player.start();
	}
	playSound(closedHat, con.currentTime);

	var waitTime = 120;
	var gotUpTo;
	
	function playBeats(step){
			if (seq[0][step % seq[0].length]){
				playSound(closedHat);
			}
			if (seq[1][step % seq[1].length]){
				playSound(openHat);
			}
			if (seq[2][step % seq[2].length]){
				playSound(snare);
			}
			if (seq[3][step % seq[3].length]){
				playSound(kick);
			}
			if (seq[4][step % seq[4].length]){
				playSound(lowTom);
			}
			if (seq[5][step % seq[5].length]){
				playSound(midTom);
			}
			if (seq[6][step % seq[6].length]){
				playSound(highTom);
			}
			if (seq[7][step % seq[7].length]){
				playSound(medCrash);
			}
	}

	var counter = new Nexus.Counter(0, 8);
	var interval = new Nexus.Interval(waitTime, function(){
		playBeats(counter.next());
	});

	interval.start();

	function loadSample(url, callback){
	    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function(){
	        var audioData = request.response;
	        con.decodeAudioData(audioData, function(buffer) {
	            console.log(buffer);
	            callback(buffer);
	        });
	    };
	    request.send();
	};

	tempoDial.on('change', function(bpm){
		bps = bpm/60;
		waitTime = 1/bps * 1000;
		interval.ms(waitTime);
	});

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
