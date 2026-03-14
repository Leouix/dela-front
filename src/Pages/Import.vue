<script setup>
import {useImportStore} from '@/stores/import.js'
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
import NoticeSuccess from "@/components/NoticeSuccess.vue";
import NoticeError from "@/components/NoticeError.vue";

const store = useImportStore()

</script>

<template>
  <main-header />

  <NoticeError />

  <NoticeSuccess />

  <div class="page page-import content">
    <h1>Import Your Candidates from CSV files like this:</h1>

    <div class="video-wrapper">
      <video controls>
        <source src="/videos/import.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>

    <p class="text-underline">File <i>test.csv</i> example:</p>
    <blockquote>
      name,age,gender,profession,experience,location,form_job,citizenship,salary<br>
      Tamara Forest,25,F,Teacher,5,KZ,RemoteJob,Uz,100<br>
      John Doe,34,M,Artist,10,Ru_loc,Funny,Vietnamec,1000<br>
      Tim Martines,23,F,Mechanic,20,Eng,Hardwork,,555<br>
      Sui Tyine,67,M,Artist,40,Ru_loc,Funny,Vietnamec,1000<br>
      Elize Pomise,89,M,Artist,50,Ru_loc,Funny,Vietnamec,1000<br>
    </blockquote>

    <h3>What in this file?</h3>

    <ul>
      <li>The symbol <span>','</span> is main separator of the top file columns</li>
      <li>The symbol <span>'F'</span> is 'female' for column 'gender'</li>
      <li>The symbol <span>'M'</span> is 'male' for column 'gender'</li>
      <li><span>'Teacher', 'Artist', 'Mechanic', ... </span> is values for <span>'profession'</span> column</li>
    </ul>

    <form id="import-form" @submit.prevent="store.formSubmit" enctype="multipart/form-data">
      <input type="file" name="file" accept=".csv">
      <button type="submit">Import CSV</button>
      <a v-if="store.showLinkResults" href="/">Check Your Result!</a>
    </form>
  </div>

  <main-footer />

</template>
