import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from '@material-ui/core/Input'
import IconButton from "@material-ui/core/IconButton";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import FullScreen from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",

    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const Controls = forwardRef(
  (
    {
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      played,
      elapsedTime,
      totalDuration,
      onMute,
      muted,
      onVolumeSeekDown,
      onChangeDispayFormat,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      volume,
      onVolumeChange,
      onAddSubtitle,
      onOffsetSub,
      OffsetSub,
      title,
      audioTracks,
      onAudioTrackChange
    },
    ref
  ) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorSub, setAnchorSub] = useState(null);
    const [anchoraudio, setAnchorAudio] = useState(null);
    const handlePlayRate = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleSubtitles = (event) => {
      setAnchorSub(event.currentTarget);
    };
    const handleAudio = (event) => {
      setAnchorAudio(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setAnchorSub(null);
      setAnchorAudio(null);
    };

    const open = Boolean(anchorEl);
    const openSubPop = Boolean(anchorSub);
    const openaudioPop = Boolean(anchoraudio);
    const id = open ? "simple-popover" : undefined;

    return (
      <div ref={ref} className={classes.controlsWrapper}>
        <Grid
          container
          direction="column"
          justify="space-between"
          style={{ flexGrow: 1 }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ padding: 16 }}
          >
            <Grid item>
              <Typography variant="h5" style={{ color: "#fff" }}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <input id='subtitle-input' onChange={onAddSubtitle} type ='file' style= {{display:'none'}}  />
              <Button
                onClick={handleSubtitles /**/}
                variant="contained"
                color="primary"
                startIcon={<BookmarkIcon />}
              >
                Subtitles
              </Button> 
              <Popover
                container={ref.current}
                open={openSubPop}
                // id={id}
                onClose={handleClose}
                anchorEl={anchorSub}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin = {{
                  horizontal:'center'
                }}
                
              >
                <Grid container direction="column">
                    <Button
                      onClick={()=>document.getElementById('subtitle-input').click()}
                      variant="text"
                    >
                    <Typography variant="h8" style={{ color: "#000" }}>
                    Add Subtitle
                  </Typography>
                    </Button>
                    <Input placeholder='Offset' value={OffsetSub} onChange={onOffsetSub} type='Number' style= {{width:'130px'}} />
                </Grid>
              </Popover>
            
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <IconButton
              onClick={onRewind}
              className={classes.controlIcons}
              aria-label="rewind"
            >
              <FastRewindIcon
                className={classes.controlIcons}
                fontSize="inherit"
              />
            </IconButton>
            <IconButton
              onClick={onPlayPause}
              className={classes.controlIcons}
              aria-label="play"
            >
              {playing ? (
                <PauseIcon fontSize="inherit" />
              ) : (
                <PlayArrowIcon fontSize="inherit" />
              )}
            </IconButton>
            <IconButton
              onClick={onFastForward}
              className={classes.controlIcons}
              aria-label="forward"
            >
              <FastForwardIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          {/* bottom controls */}
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ padding: 16 }}
          >
            <Grid item xs={12}>
              <PrettoSlider
                min={0}
                max={100}
                ValueLabelComponent={(props) => (
                  <ValueLabelComponent {...props} value={elapsedTime} />
                )}
                aria-label="custom thumb label"
                value={played * 100}
                onChange={onSeek}
                onMouseDown={onSeekMouseDown}
                onChangeCommitted={onSeekMouseUp}
              />
            </Grid>

            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  onClick={onMute}
                  className={`${classes.bottomIcons} ${classes.volumeButton}`}
                >
                  {muted ? (
                    <VolumeMute fontSize="large" />
                  ) : volume > 0.5 ? (
                    <VolumeUp fontSize="large" />
                  ) : (
                    <VolumeDown fontSize="large" />
                  )}
                </IconButton>

                <Slider
                  min={0}
                  max={100}
                  value={muted ? 0 : volume * 100}
                  onChange={onVolumeChange}
                  aria-labelledby="input-slider"
                  className={classes.volumeSlider}
                  onMouseDown={onSeekMouseDown}
                  onChangeCommitted={onVolumeSeekDown}
                />
                <Button
                  variant="text"
                  onClick={
                    onChangeDispayFormat
                  }
                >
                  <Typography
                    variant="body1"
                    style={{ color: "#fff", marginLeft: 16 }}
                  >
                    {elapsedTime}/{totalDuration}
                  </Typography>
                </Button>
              </Grid>
            </Grid>

            <Grid item>

              <Button
                onClick={handleAudio}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography>audio</Typography>
              </Button>

              <Popover
                container={ref.current}
                open={openaudioPop}
                id={id}
                onClose={handleClose}
                anchorEl={anchoraudio}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <Grid container direction="column-reverse">
                  {audioTracks.map((track,index) => (
                    <Button
                      key={track}
                      //   onClick={() => setState({ ...state, playbackRate: rate })}
                      onClick={() => onAudioTrackChange(index)}
                      variant="text"
                    >
                        {track}
                    </Button>
                  ))}
                </Grid>
              </Popover>

              {/* ******************************** */}
              <Button
                onClick={handlePlayRate}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography>{playbackRate}X</Typography>
              </Button>

              <Popover
                container={ref.current}
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      //   onClick={() => setState({ ...state, playbackRate: rate })}
                      onClick={() => onPlaybackRateChange(rate)}
                      variant="text"
                    >
                      <Typography
                        color={rate === playbackRate ? "secondary" : "inherit"}
                      >
                        {rate}X
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
               {/* ******************************** */}                          
              <IconButton
                onClick={onToggleFullScreen}
                className={classes.bottomIcons}
              >
                <FullScreen fontSize="large" />
              </IconButton>
            
              </Grid>
                       
                  {/* ******************************** */}
            </Grid>
        </Grid>
      </div>
    );
  }
);

Controls.propTypes = {
  onSeek: PropTypes.func,
  onSeekMouseDown: PropTypes.func,
  onSeekMouseUp: PropTypes.func,
  onAddSubtitle: PropTypes.func,
  onOffsetSub: PropTypes.func,
  onAudioTrackChange: PropTypes.func,
  onRewind: PropTypes.func,
  onPlayPause: PropTypes.func,
  onFastForward: PropTypes.func,
  onVolumeSeekDown: PropTypes.func,
  onChangeDispayFormat: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
  OffsetSub: PropTypes.number,
  elapsedTime: PropTypes.string,
  audioTracks: PropTypes.array,
  totalDuration: PropTypes.string,
  muted: PropTypes.bool,
  playbackRate: PropTypes.number,
};
export default Controls;
