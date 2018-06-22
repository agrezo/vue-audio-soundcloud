<template>
  <div id="app">
    <h1>Vue audio soundcloud</h1>
    <h2>Example of soundcloud audio player</h2>
    <vue-audio-soundcloud :elements="{ timeline: 'timeline', volume: 'volume' }" @change="setNewTrack">
      <template slot-scope="{currentTrack, duration, listPosition, loop, isLoop, isPlaying, next, play, pause, previous, progression, volume}">
        <button @click="previous()" :class="{disabled: !listPosition || listPosition.first}">Prev</button>
        <button @click="play()" v-if="!isPlaying">Play</button>
        <button @click="pause()" v-else>Pause</button>
        <button @click="loop()">Loop: {{isLoop}}</button>
        <button @click="next()" :class="{disabled: !listPosition || listPosition.last}">Next</button>
        {{duration.current}} / {{duration.total}}
        {{currentTrack.title}}

        <div class="timeline" id="timeline">
          <div class="timeline-bar" :style="`width:${progression}%`"></div>
        </div>

        <div class="volume" id="volume">
          <div class="volume-bar" :style="`width:${volume}%`"></div>
        </div>
      </template>
    </vue-audio-soundcloud>
    <h4>Without list</h4>
    <p 
      @click="$audioSoundcloud.load({
        track: item,
      })"
      v-for="(item) in list"
      :key="item.id"
      :class="{selected: current === item.id}"
    >
      {{item.title}}
    </p>
    <h4>With list</h4>
    <p 
      @click="$audioSoundcloud.load({
        track: item,
        list: list,
      })"
      v-for="(item) in list"
      :key="item.id"
      :class="{selected: current === item.id}"
    >
      {{item.title}}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      current: '',
      list: [{"kind":"track","id":368897411,"created_at":"2017/12/13 10:54:13 +0000","user_id":103689541,"duration":185720,"commentable":true,"state":"finished","original_content_size":32748702,"last_modified":"2018/01/30 20:46:54 +0000","sharing":"public","tag_list":"","permalink":"baxromoff-taj-mahal-original-mix","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"http://www.tuneboost.net/track/bzKeqxAwd","label_id":null,"purchase_title":"FREE 4 U","genre":"melbourne","title":"Baxromoff - Taj Mahal (Original Mix)","description":"Absolute killer melboure tune by Baxromoff, hope you guys could show your support and share it around!! \nPlease follow and check out more of his dope tunes\n\nBaxromoff\nhttps://soundcloud.com/baxromoff","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"wav","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/368897411","user":{"id":103689541,"kind":"user","permalink":"melbourne-bounce-central","username":"MBC","last_modified":"2018/04/15 11:28:58 +0000","uri":"https://api.soundcloud.com/users/103689541","permalink_url":"http://soundcloud.com/melbourne-bounce-central","avatar_url":"https://i1.sndcdn.com/avatars-000308723390-cuwgf7-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/368897411/attachments","permalink_url":"http://soundcloud.com/melbourne-bounce-central/baxromoff-taj-mahal-original-mix","artwork_url":"https://i1.sndcdn.com/artworks-000269137082-jamv4o-large.jpg","waveform_url":"https://w1.sndcdn.com/9RFbASZCGGfP_m.png","stream_url":"https://api.soundcloud.com/tracks/368897411/stream","playback_count":0,"download_count":0,"favoritings_count":502,"comment_count":46},{"kind":"track","id":372121283,"created_at":"2017/12/20 14:01:34 +0000","user_id":334899174,"duration":179425,"commentable":true,"state":"finished","original_content_size":31635990,"last_modified":"2018/04/15 15:56:32 +0000","sharing":"public","tag_list":"","permalink":"remixwolves","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"http://www.tuneboost.net/track/pqkcpReHd","label_id":null,"purchase_title":null,"genre":"Dance & EDM","title":"Selena Gomez & Marshmello - Wolves (Outloud Remix) *Supported by Matthew Ros*","description":"We really enjoyed making our first remix , We hope you guys like it and wait for our next releases!\n\nBUY = FREE DOWNLOAD \n\nSupported by:\nMatthew Ros\n\nContact us:\nfacebook.com/outloudduo\ninstagram.com/outloudduo\n@outloudproducer\n@theoutloudradio","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":2017,"release_month":12,"release_day":17,"original_format":"wav","license":"cc-by-nc-sa","uri":"https://api.soundcloud.com/tracks/372121283","user":{"id":334899174,"kind":"user","permalink":"outloudremixes","username":"Outloud Remixes","last_modified":"2018/01/28 09:44:55 +0000","uri":"https://api.soundcloud.com/users/334899174","permalink_url":"http://soundcloud.com/outloudremixes","avatar_url":"https://i1.sndcdn.com/avatars-000366415628-n4ayps-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/372121283/attachments","permalink_url":"http://soundcloud.com/outloudremixes/remixwolves","artwork_url":"https://i1.sndcdn.com/artworks-000272512202-nfelt3-large.jpg","waveform_url":"https://w1.sndcdn.com/Why58NCCkbXh_m.png","stream_url":"https://api.soundcloud.com/tracks/372121283/stream","playback_count":0,"download_count":0,"favoritings_count":196,"comment_count":99},{"kind":"track","id":372146156,"created_at":"2017/12/20 15:17:03 +0000","user_id":40822846,"duration":226999,"commentable":true,"state":"finished","original_content_size":80055426,"last_modified":"2018/04/06 12:16:34 +0000","sharing":"public","tag_list":"\"Ceryno \" \"Origins \" \"Edm \" \"Bigroom \" 2017 CRR","permalink":"ceryno-origins","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"https://pumpyoursound.com/fangate/detail/40657-origins","label_id":null,"purchase_title":null,"genre":"Dance & EDM","title":"Ceryno - Origins [CRR001]","description":"Proud to give you away for free my last track of 2017! Spent a lot of time on it so i hope you guys will like it! I'm already working on lot of collabs and solos so be ready for 2018 which will be surprising!\n \nEnjoy, Ceryno.\n\n*BUY = FREE DOWNLOAD\nThis track is a co-release with Crashed Collective.","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"wav","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/372146156","user":{"id":40822846,"kind":"user","permalink":"ceryno","username":"Ceryno","last_modified":"2018/04/07 19:52:08 +0000","uri":"https://api.soundcloud.com/users/40822846","permalink_url":"http://soundcloud.com/ceryno","avatar_url":"https://i1.sndcdn.com/avatars-000370103915-v7dih5-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/372146156/attachments","permalink_url":"http://soundcloud.com/ceryno/ceryno-origins","artwork_url":"https://i1.sndcdn.com/artworks-000272544347-e4sr70-large.jpg","waveform_url":"https://w1.sndcdn.com/iTNOgBSheePF_m.png","stream_url":"https://api.soundcloud.com/tracks/372146156/stream","playback_count":0,"download_count":0,"favoritings_count":231,"comment_count":112},{"kind":"track","id":371262872,"created_at":"2017/12/18 17:29:35 +0000","user_id":125039276,"duration":225900,"commentable":true,"state":"finished","original_content_size":9336294,"last_modified":"2017/12/29 15:52:47 +0000","sharing":"public","tag_list":"\"Electro House\" \"Big Room\" Groove EDM 303","permalink":"pajane-radio","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"https://www.toneden.io/panthers-groove/post/pajane-radio","label_id":null,"purchase_title":"Free Download","genre":"PANTHER","title":"Pajane - Radio ● Supported by LoaX ●","description":"A warm Panther's Groove welcome back to the limelight for enormously talented German producer Pajane. Following successful Panther's Groove releases with 'Bring The Funk Back' and 'Fire', in the summer, Pajane is back on the imprint with his 303-lead electro-groove track: 'Radio'. \n\nDownload FREE: https://www.toneden.io/panthers-groove/post/pajane-radio\n\nSave on Spotify: https://open.spotify.com/track/0WEaHmlSwEn3cC9JSHrekw\n\nFollow Pajane:\nhttps://soundcloud.com/pajanemusic\nhttps://www.facebook.com/pajanemusic\nhttps://twitter.com/pajanemusic\nhttps://www.instagram.com/philip__p_/\nhttps://open.spotify.com/artist/3xur0inruYquZ8zO73xq1q\n\nFollow Panther's Groove:\nopen.spotify.com/user/x43zjmj9fxfa65thdh3xeetli\nwww.youtube.com/channel/UCwbFekB6WGIWjlPXPP_vlSg\nwww.facebook.com/panthersgroove\nSoundcloud.com/panthersgroove\nSoundcloud.com/panthersdeep\nSoundcloud.com/pantherstrap\nSoundcloud.com/panthershouse\nSoundcloud.com/panthersbasshouse\nSoundcloud.com/panthersafterparty\nSoundcloud.com/pantherslondon\nSoundcloud.com/panthersmiami\nSoundcloud.com/panthersibiza\nSoundcloud.com/pantherspacks\n\nCopyright and worldwide exclusive rights licensed to Panther's Groove Ltd - London. You must ask permission from Panther's Groove prior to uploading. Unauthorised distribution is strictly prohibited.","label_name":"Panther's Groove","release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":2017,"release_month":12,"release_day":18,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/371262872","user":{"id":125039276,"kind":"user","permalink":"panthersgroove","username":"Panther's Groove","last_modified":"2018/04/16 15:25:34 +0000","uri":"https://api.soundcloud.com/users/125039276","permalink_url":"http://soundcloud.com/panthersgroove","avatar_url":"https://i1.sndcdn.com/avatars-000430285224-puou72-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/371262872/attachments","permalink_url":"http://soundcloud.com/panthersgroove/pajane-radio","artwork_url":"https://i1.sndcdn.com/artworks-000271511606-jky3ip-large.jpg","waveform_url":"https://w1.sndcdn.com/AzbqFU0wH1Yx_m.png","stream_url":"https://api.soundcloud.com/tracks/371262872/stream","playback_count":0,"download_count":0,"favoritings_count":556,"comment_count":40},{"kind":"track","id":342765224,"created_at":"2017/09/17 16:26:49 +0000","user_id":9616421,"duration":283741,"commentable":true,"state":"finished","original_content_size":11346617,"last_modified":"2018/02/24 15:54:33 +0000","sharing":"public","tag_list":"Aceaxe \"Patrick Moreno\" \"Jonny Rose\" \"CHasing Love\"","permalink":"aceaxe-x-patrick-moreno-ft-jonny-rose-chasing-love-original-mix","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"http://www.tuneboost.net/track/YTkHzeNAk","label_id":null,"purchase_title":"Stream/Download","genre":"Progressive House","title":"Aceaxe X Patrick Moreno Ft. Jonny Rose - Chasing Love (Original Mix)","description":"Official Videoclip- https://youtu.be/cXhtPK-mIWk\n\n● Follow Patrick Moreno:\nfacebook.com/patrickmorenoofficial\ntwitter.com/djsmoreno \n@moreno-official \ninstagram.com/patrick_moreno_","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/342765224","user":{"id":9616421,"kind":"user","permalink":"moreno-official","username":"Patrick Moreno","last_modified":"2018/03/04 17:47:46 +0000","uri":"https://api.soundcloud.com/users/9616421","permalink_url":"http://soundcloud.com/moreno-official","avatar_url":"https://i1.sndcdn.com/avatars-000070811360-svhymf-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/342765224/attachments","permalink_url":"http://soundcloud.com/moreno-official/aceaxe-x-patrick-moreno-ft-jonny-rose-chasing-love-original-mix","artwork_url":"https://i1.sndcdn.com/artworks-000270246599-1josf3-large.jpg","waveform_url":"https://w1.sndcdn.com/8brA2WrFENU5_m.png","stream_url":"https://api.soundcloud.com/tracks/342765224/stream","playback_count":0,"download_count":0,"favoritings_count":493,"comment_count":77},{"kind":"track","id":370820765,"created_at":"2017/12/17 18:07:37 +0000","user_id":276045140,"duration":170830,"commentable":true,"state":"finished","original_content_size":6830568,"last_modified":"2018/04/09 19:11:41 +0000","sharing":"public","tag_list":"","permalink":"psr007","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"https://www.slammes.com/gate/3340","label_id":null,"purchase_title":"FREE EXTENDED MIX💥💣","genre":"Dance & EDM","title":"Pharien - Infernal","description":"Our newest release by Pharien!!\nDon't miss to check him out!\n\n@iampharien\nhttps://twitter.com/ItsRealPharien","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/370820765","user":{"id":276045140,"kind":"user","permalink":"pinkshrimprecords","username":"Pink Shrimp Records","last_modified":"2017/12/17 18:10:54 +0000","uri":"https://api.soundcloud.com/users/276045140","permalink_url":"http://soundcloud.com/pinkshrimprecords","avatar_url":"https://i1.sndcdn.com/avatars-000367403639-19zzg0-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/370820765/attachments","permalink_url":"http://soundcloud.com/pinkshrimprecords/psr007","artwork_url":"https://i1.sndcdn.com/artworks-000271110068-qxkyna-large.jpg","waveform_url":"https://w1.sndcdn.com/UDs4aRDX7zJs_m.png","stream_url":"https://api.soundcloud.com/tracks/370820765/stream","playback_count":0,"download_count":0,"favoritings_count":384,"comment_count":162},{"kind":"track","id":370411928,"created_at":"2017/12/16 17:02:41 +0000","user_id":73848296,"duration":170726,"commentable":true,"state":"finished","original_content_size":45152690,"last_modified":"2017/12/24 10:48:11 +0000","sharing":"public","tag_list":"Make \"Big Room\" Great Again 2K18 \"Festival Music\" Edm Revealed","permalink":"eskry-dasmman-marble-out-now","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":"https://theartistunion.com/tracks/f97b68","label_id":null,"purchase_title":null,"genre":"Big Room","title":"ESKRY & Dasmman - Marble (OUT NOW)","description":"been a while since I uploaded any fucking thing so here's a collab I did w/ @dasmman enjoy yall!!\n\n<a href=\"https://theartistunion.com/tracks/f97b68\" rel=\"nofollow\" target=\"_blank\">Download for free on The Artist Union</a>","label_name":null,"release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"wav","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/370411928","user":{"id":73848296,"kind":"user","permalink":"eskryyy","username":"ESKRY","last_modified":"2017/11/16 18:49:47 +0000","uri":"https://api.soundcloud.com/users/73848296","permalink_url":"http://soundcloud.com/eskryyy","avatar_url":"https://i1.sndcdn.com/avatars-000350839418-iq8rfu-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/370411928/attachments","permalink_url":"http://soundcloud.com/eskryyy/eskry-dasmman-marble-out-now","artwork_url":"https://i1.sndcdn.com/artworks-000270725240-p16xgs-large.jpg","waveform_url":"https://w1.sndcdn.com/n22bu6lKBgKS_m.png","stream_url":"https://api.soundcloud.com/tracks/370411928/stream","playback_count":0,"download_count":0,"favoritings_count":43,"comment_count":19},{"kind":"track","id":362950274,"created_at":"2017/11/30 12:58:25 +0000","user_id":229464633,"duration":213910,"commentable":true,"state":"finished","original_content_size":8553604,"last_modified":"2018/04/06 12:16:38 +0000","sharing":"public","tag_list":"","permalink":"myth011","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"MYTH011","title":"JONAS - Heat (Original Mix)","description":"JONAS returns to Mythical Recordings with a perfect Big-Room House banger. This is Heat!\n\nFree Download : https://pumpyoursound.com/fangate/detail/40093-jonas-heat\n\nFollow Jonas Here\nhttps://soundcloud.com/jonas_dj\nFacebook : www.facebook.com/Jonas-442963282715440\n\nFollow Us Here\nSoundcloud : @mythicalrecordings\nFacebook: www.facebook.com/MythicalRecordings/\n\nSubmit Your Music : demos.mythicalrecordings@gmail.com","label_name":"Mythical Recordings","release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/362950274","user":{"id":229464633,"kind":"user","permalink":"mythicalrecordings","username":"Mythical Recordings","last_modified":"2018/04/06 12:16:26 +0000","uri":"https://api.soundcloud.com/users/229464633","permalink_url":"http://soundcloud.com/mythicalrecordings","avatar_url":"https://i1.sndcdn.com/avatars-000375522878-h0k5im-large.jpg"},"attachments_uri":"https://api.soundcloud.com/tracks/362950274/attachments","permalink_url":"http://soundcloud.com/mythicalrecordings/myth011","artwork_url":"https://i1.sndcdn.com/artworks-000263187092-3g6t3e-large.jpg","waveform_url":"https://w1.sndcdn.com/RFbsrx0dH0b2_m.png","stream_url":"https://api.soundcloud.com/tracks/362950274/stream","playback_count":0,"download_count":0,"favoritings_count":286,"comment_count":79}]
    }),
    methods: {
      setNewTrack (id) {
        this.current = id
      }
    },
  }
</script>

<style lang="stylus">
  .disabled
    color red

  .selected
    color red

  .timeline
    position relative
    display flex
    align-items center
    width 350px
    height 40px
    &:before
      content ""
      display block
      background #ccc
      width 100%
      height 8px
      border-radius 100px
  
  .timeline-bar
    background blue
    border-radius 100px
    height 8px
    left 0
    position absolute


  .volume
    position relative
    display flex
    align-items center
    width 350px
    height 40px
    &:before
      content ""
      display block
      background #ccc
      width 100%
      height 8px
      border-radius 100px
  
  .volume-bar
    background green
    border-radius 100px
    height 8px
    left 0
    position absolute
</style>
