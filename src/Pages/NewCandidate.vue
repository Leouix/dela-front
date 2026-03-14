<script setup>
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
import {useCandidateStore} from "@/stores/candidate.js";

const store = useCandidateStore();

</script>

<template>

  <div>

    <main-header />

    <div class="page content candidate-page">



      <h1>Candidate Info:</h1>

      <div class="candidate-card">

<!--        <picture class="avatar">-->
<!--          <source v-bind:srcset="store.getAvatarUrl" type="image/webp">-->
<!--          <source v-bind:srcset="store.getAvatarUrl" type="image/jpeg">-->
<!--          <img id="candidate-avatar" class="avatar" v-bind:src="store.getAvatarUrl" alt="candidate avatar">-->
<!--        </picture>-->

        <img id="candidate-avatar" class="avatar" v-bind:src="store.getAvatarUrl" alt="candidate avatar">

        <div class="candidate-info">

          <form id="create-candidate-form"  @submit.prevent="store.createCandidate" method="post" enctype="multipart/form-data">

            <input
                type="file"
                class="form-control"
                name="avatar"
                @change="store.onchangeAvatar"
            >

            <div class="form-group form-item">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name" name="name">
            </div>

            <div class="form-group form-item">
              <label for="age">Age</label>
              <input type="text" class="form-control" id="age" name="age">
            </div>

            <div class="form-group form-item">
              <label for="gender">Gender</label>
              <input type="text" class="form-control" id="gender" name="gender">
            </div>

            <div class="form-group form-item">
              <label for="profession">Profession</label>
              <input type="text" class="form-control" id="profession" name="profession">
            </div>

            <div class="form-group form-item">
              <label for="experience">Experience</label>
              <input type="text" class="form-control" id="experience" name="experience">
            </div>

            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" class="form-control" id="location" name="location">
            </div>

            <div class="form-group">
              <label for="form_job">Form Job</label>
              <input type="text" class="form-control" id="form_job" name="form_job">
            </div>

            <div class="form-group">
              <label for="citizenship">Citizenship</label>
              <input type="text" class="form-control" id="citizenship" name="citizenship">
            </div>

            <div class="form-group">
              <label for="salary">Salary</label>
              <input type="text" class="form-control" id="salary" name="salary">
            </div>

            <button type="submit" class="btn btn-primary" >Создать карточку</button>
            <div id="save-error" v-if="store.saveError">{{store.saveError}}</div>

          </form>

        </div>

      </div>

      <section id="notes">

        <form id="form-notes" @submit.prevent="store.createNote" enctype="text/plain">
          <textarea name="text" id="text-note" rows="10"></textarea>
          <input name="candidate_id" type="hidden" v-bind:value="store.candidate.id">
          <div class="button-area">
            <input type="submit">
          </div>

          <div
              class="notes-items"
              v-for="note in store.notes"
              :key="note.id"
          >
            <div class="note-item" >
              <div class="note-row">
                <div
                    :id="'note-item-dt-' + note.id" class="date-time"
                    :contenteditable="store.datetimeEditables[note.id]"
                >
                  {{note.custom_date ?? note.updated_at}}
                </div>
                <div class="actions">
                  <div class="action" >
                    <div
                        @click="store.editDatetime(note.id)"
                        :class="store.datetimeEditables[note.id] ? 'action-lock unlocked' : 'action-lock locked'"
                    ></div>
                    <div
                        @click="store.editDatetime(note.id)"
                    >edit Date Time</div>
                  </div>
                  <div class="action" >
                    <div
                        @click="store.editTextNote(note.id)"
                        :class="store.textEditableIds[note.id] ? 'action-lock unlocked' : 'action-lock locked'"
                    ></div>
                    <div
                        @click="store.editTextNote(note.id)"
                    >edit Text</div>
                  </div>
                </div>
              </div>

              <p :id="'note-item-text-' + note.id" class="text transition-selector" :contenteditable="store.textEditableIds[note.id]" >
                {{note.text}}
              </p>

              <div class="remove-note" @click="store.removeNote(note.id)">Remove</div>

            </div>

          </div>

        </form>



      </section>

    </div>
    <main-footer />
  </div>


</template>
