// Generated by CoffeeScript 1.4.0
(function() {

  window.plugins.efficiency = {
    emit: function(div, item) {
      div.addClass('data');
      $('<p />').addClass('readout').appendTo(div).text("0%");
      return $('<p />').html(wiki.resolveLinks(item.text || 'efficiency')).appendTo(div);
    },
    bind: function(div, item) {
      var calculate, calculatePercentage, calculateStrategy_GrayBinary, calculateStrategy_GrayIterativeClustering, display, getImageData, lastThumb, locate;
      lastThumb = null;
      div.find('p:first').dblclick(function(e) {
        return wiki.dialog("JSON for " + item.text, $('<pre/>').text("something good"));
      });
      div.find('p:last').dblclick(function() {
        return wiki.textEditor(div, item);
      });
      locate = function() {
        var idx;
        idx = $('.item').index(div);
        return $(".item:lt(" + idx + ")").filter('.image:last');
      };
      calculate = function(div) {
        return calculatePercentage(getImageData(div));
      };
      display = function(value) {
        return div.find('p:first').text("" + (value.toFixed(1)) + "%");
      };
      getImageData = function(div) {
        var c, d, h, imageData, img, w;
        img = new Image;
        img.src = $(div).data('item').url;
        w = img.width;
        h = img.height;
        c = $('<canvas id="myCanvas" width="#{w}" height="#{h}">');
        d = c.get(0).getContext("2d");
        d.drawImage(img, 0, 0);
        wiki.log('efficiency img w, h', w, h, 'c w, h ', c.width(), c.height());
        imageData = d.getImageData(0, 0, w, h);
        return imageData.data;
      };
      calculatePercentage = function(data) {
        return calculateStrategy_GrayBinary(data);
      };
      calculateStrategy_GrayBinary = function(data) {
        var B, G, R, i, l, luma, lumaHighCount, lumaLowCount, lumaMax, lumaMid, lumaMin, lumas, numPix, percentage, _i, _j, _len;
        numPix = data.length / 4;
        lumaMin = 255;
        lumaMax = 0;
        lumas = [];
        for (i = _i = 0; 0 <= numPix ? _i <= numPix : _i >= numPix; i = 0 <= numPix ? ++_i : --_i) {
          R = data[i * 4 + 0];
          G = data[i * 4 + 1];
          B = data[i * 4 + 2];
          luma = lumas[i] = 0.299 * R + 0.587 * G + 0.114 * B;
          if (luma > lumaMax) {
            lumaMax = luma;
          }
          if (luma < lumaMin) {
            lumaMin = luma;
          }
        }
        lumaMid = (lumaMax - lumaMin) / 2;
        lumaLowCount = 0;
        lumaHighCount = 0;
        for (_j = 0, _len = lumas.length; _j < _len; _j++) {
          l = lumas[_j];
          if (l <= lumaMid) {
            lumaLowCount++;
          } else {
            lumaHighCount++;
          }
        }
        percentage = lumaHighCount / numPix * 100;
        return percentage;
      };
      calculateStrategy_GrayIterativeClustering = function(data) {
        var B, G, MAX_TRIES, R, THRESHOLD_CONVERGENCE_GOAL, high, i, l, low, luma, lumaAvgHigh, lumaAvgLow, lumaHighCount, lumaHighTotal, lumaLowCount, lumaLowTotal, lumaMax, lumaMin, lumas, lumasHigh, lumasLow, numPix, numTries, percentage, threshold, thresholdDiff, thresholdInitial, _i, _j, _k, _l, _len, _len1, _len2;
        THRESHOLD_CONVERGENCE_GOAL = 5;
        MAX_TRIES = 10;
        numPix = Math.floor(data.length / 4);
        lumaMin = 255;
        lumaMax = 0;
        lumas = [];
        for (i = _i = 0; 0 <= numPix ? _i <= numPix : _i >= numPix; i = 0 <= numPix ? ++_i : --_i) {
          R = data[i * 4 + 0];
          G = data[i * 4 + 1];
          B = data[i * 4 + 2];
          luma = lumas[i] = 0.299 * R + 0.587 * G + 0.114 * B;
          if (luma > lumaMax) {
            lumaMax = luma;
          }
          if (luma < lumaMin) {
            lumaMin = luma;
          }
        }
        thresholdInitial = (lumaMax - lumaMin) / 2;
        threshold = thresholdInitial;
        lumaHighCount = 0;
        numTries = 0;
        while (numTries < MAX_TRIES) {
          numTries++;
          lumasLow = [];
          lumasHigh = [];
          lumaLowCount = 0;
          lumaHighCount = 0;
          for (_j = 0, _len = lumas.length; _j < _len; _j++) {
            l = lumas[_j];
            if (l <= threshold) {
              lumasLow.push(l);
              lumaLowCount++;
            } else {
              if (l !== NaN) {
                lumasHigh.push(l);
                lumaHighCount++;
              }
            }
          }
          lumaLowTotal = 0;
          for (_k = 0, _len1 = lumasLow.length; _k < _len1; _k++) {
            low = lumasLow[_k];
            if (!isNaN(low)) {
              lumaLowTotal += low;
            } else {
              wiki.log('Found a NaN low ', low);
            }
          }
          lumaAvgLow = 0;
          if (lumaLowCount > 0) {
            lumaAvgLow = lumaLowTotal / lumaLowCount;
          }
          lumaHighTotal = 0;
          wiki.log('lumasHigh ', lumasHigh);
          for (_l = 0, _len2 = lumasHigh.length; _l < _len2; _l++) {
            high = lumasHigh[_l];
            if (!isNaN(high)) {
              lumaHighTotal += high;
            } else {
              wiki.log('Found a NaN high', high);
            }
          }
          lumaAvgHigh = 0;
          if (lumaHighCount > 0) {
            lumaAvgHigh = lumaHighTotal / lumaHighCount;
          }
          wiki.log('lumaLowCount ', lumaLowCount, '  lumaHighCount ', lumaHighCount);
          wiki.log('lumaLowTotal ', lumaLowTotal, '  lumaHighTotal ', lumaHighTotal);
          wiki.log('lumaAvgLow ', lumaAvgLow, '  lumaAvgHigh ', lumaAvgHigh);
          threshold = (lumaAvgHigh - lumaAvgLow) / 2;
          thresholdDiff = Math.abs(threshold - thresholdInitial);
          wiki.log('numTries ', numTries, '  thresholdDiff ', thresholdDiff, '  thresholdInitial ', thresholdInitial, '  threshold new ', threshold);
          if (thresholdDiff <= THRESHOLD_CONVERGENCE_GOAL || numTries > MAX_TRIES) {
            wiki.log("we're done");
            break;
          } else {
            thresholdInitial = threshold;
          }
        }
        percentage = lumaHighCount / numPix * 100;
        if (percentage > 100.0) {
          percentage = 100;
        }
        return percentage;
      };
      return display(calculate(locate()));
    }
  };

}).call(this);
