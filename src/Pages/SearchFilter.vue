<script setup>
import {useSearchFilterStore} from '@/stores/search-and-filter.js'
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";

const store = useSearchFilterStore()

const props = defineProps([
  'candies',
  'professions',
  'locations',
  'citizenships',
  'formJobs',
])

store.items = props.candies

function toCheck(e) {

  const activeEl = e.target;

  let male = document.getElementById('male-gender')
  let female = document.getElementById('female-gender')

  if (activeEl === male) {
    female.checked = false
  }
  if (activeEl === female) {
    male.checked = false
  }
}

</script>

<template>

  <main-header />

  <div>

    <div id="search-filter-section" >

      <div class="form-wrapper content search-filter" >

        <h1>По каким критериям выполнить&nbsp;поиск:</h1>

        <form id="filter-candidates" @submit.prevent="store.formSubmit">

          <div class="filter-row filter-row-name">
            <label for="name">Name</label>
            <input id="name" class="bg-transparent" type="text" name="name">
          </div>

          <div class="filter-row">
            <div class="div-label">Age</div>
            <div class="div-input">
              <label for="min-age">от: </label>
              <input id="min-age" type="number" name="min_age">
              <label for="max-age">до: </label>
              <input id="max-age" type="number" name="max_age">
            </div>
          </div>

          <div class="filter-row">

            <div class="div-label">Gender</div>
            <div class="div-input">

              <label for="male-gender">
                <input type="checkbox" id="male-gender" name="gender" value="male" @change="toCheck">
                Male</label><br>

              <label for="female-gender">
                <input type="checkbox" id="female-gender" name="gender" value="female" @change="toCheck">
                Female</label><br>
            </div>

          </div>

          <div class="filter-row">
            <div class="div-label">Profession</div>
            <div class="div-input">
              <select name="profession" id="profession">
                <option value="" >Not chosen</option>
                <option
                    v-for="profession in props.professions"
                    :key="profession?.id ?? 'profession' + store.getKeyId"
                    class="list-professions-item"
                    v-bind:value="profession"
                >
                  {{profession}}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="div-label">Experience</div>
            <div class="div-input">
              <label for="min-experience">от: </label>
              <input id="min-experience" type="number" name="min_experience">
              <label for="max-experience">до: </label>
              <input id="max-experience" type="number" name="max_experience">
            </div>

          </div>

          <div class="filter-row">
            <div class="div-label">Location</div>
            <div class="div-input">
              <select name="location" id="location">
                <option value="" >Not chosen</option>
                <option
                    v-for="location in props.locations"
                    :key="location?.id ?? 'location' + store.getKeyId"
                    class="list-locations-item"
                    v-bind:value="location"
                >
                  {{location}}
                </option>
              </select>

            </div>
          </div>


          <div class="filter-row">
            <div class="div-label">FormJob</div>
            <div class="div-input">
              <select name="form_job" id="formJob">
                <option value="" >Not chosen</option>
                <option
                    v-for="formJob in props.formJobs"
                    :key="formJob?.id ?? 'formJob' + store.getKeyId"
                    class="list-locations-item"
                    v-bind:value="formJob"
                >
                  {{formJob}}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="div-label">Citizenship</div>
            <div class="div-input">
              <select name="citizenship" id="citizenship">
                <option value="">Not chosen</option>
                <option
                    v-for="citizenship in props.citizenships"
                    :key="citizenship?.id ?? 'citizenship' + store.getKeyId"
                    class="list-locations-item"
                    v-bind:value="citizenship"
                >
                  {{citizenship}}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="div-label">Salary</div>
            <div class="div-input">
              <label for="min-salary">от: </label>
              <input id="min-salary" type="number" class="salary-number" name="min_salary">
              <label for="max-salary">до: </label>
              <input id="max-salary" type="number" class="salary-number" name="max_salary">
            </div>
          </div>

          <div class="buttons-area">
            <div class="form-reset">
              <button @click.prevent="store.formReset">Reset Form</button>
            </div>
            <input type="submit" value="Поиск">
          </div>

        </form>
      </div>

      <div class="count-candies">В списке <span>{{store.countItems}}</span> записей</div>

      <div class="list-candidates">

        <div v-for="candy in store.items" :key="candy.id" class="list-candidates-item">

          <div class="side-face">

            <picture class="avatar">
              <source v-bind:srcset="candy.avatar?.url ?? '/images/default-ava-5.png'" type="image/webp">
              <source v-bind:srcset="candy.avatar?.url ?? '/images/default-ava-5.png'" type="image/jpeg">
              <img id="candidate-avatar" class="avatar" v-bind:src="candy.avatar?.url ?? '/images/default-ava-5.png'" alt="candidate avatar">
            </picture>
            {{candy.location}}
          </div>
          <div class="side-text">
            <a v-bind:href="'/card/' + candy.id" target="_blank" rel="noopener noreferrer"><div class="params">Name: {{candy.name}}</div></a>
            <div class="params">Age: {{candy.age}}</div>
            <div class="params">Profession: {{candy.profession}}</div>
            <div class="params">Citizenship: {{candy.citizenship}}</div>
            <div class="params">Experience: {{candy.experience}}</div>
            <div class="params">Form Job: {{candy.form_job}}</div>
            <div class="params">Gender: {{candy.gender}}</div>
            <div class="params">Salary: {{candy.salary}}</div>
          </div>
        </div>
      </div>

    </div>

    <main-footer />
  </div>
</template>
