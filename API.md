---
permalink: api/
---
<head>
  <title>Trackbox Plugin API</title>
  <link rel="stylesheet" type="text/css" href="../api.css" />
</head>

This is a definition working document for the first version of the API. It is undergoing heavy development and it is not ready for use.

*This is the API made for third-party plugins to use. Changes to the API that could break an existing plugin will be made in a new API version.*

---

###### playbackState()
Returns: **playing** *(string)*, **paused** *(string)*, **stopped** *(string)*

Returns the current music state.

---

###### playbackStateSet(*Parameter 1*)
Parameter 1: **playing** *(string)*, **paused** *(string)*, **stopped** *(string)*

Sets the music state.

---

###### playbackStateOnChange(callback(data))
Return value: **playing** *(string)*, **paused** *(string)*, **stopped** *(string)*

Called when the music state changes.

---

###### playbackVolume
Returns: **volume** *(int)*

Returns the current volume, an integer between 0 and 100.

---

###### playbackVolumeSet(*Parameter 1*)
Parameter 1: **volume** *(int)*

Sets a value between 0 and 100.

---

###### playbackVolumeOnChange(callback(data))
Return value: **volume** *(int)*

Called when the music volume changes.

---

###### playbackMuted()
Returns: **muted** *(bool)*

Returns a true or false where true is muted and false is unmuted.

---

###### playbackMutedSet(*Parameter 1*)
Parameter 1: **muted** *(bool)*

Set to true to mute playback or false to unmute playback

---

###### playbackMutedSetToggle()

Toggles mute/unmute when called

---

###### playbackMutedOnChange(callback(data))
Return value: **muted** *(bool)*

Called when music playback is muted or unmuted. Return value includes the new state (true is muted, false is unmuted).
