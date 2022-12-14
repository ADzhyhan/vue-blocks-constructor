import {mapMutations, mapGetters} from "vuex";
// import _ from 'lodash';
import {validationMixin} from 'vuelidate'
import {maxLength, required, url} from "vuelidate/lib/validators";

//sections

export default {
  name: "forma",
  mixins: [validationMixin], 
  components:{

  },
  data(){
    return{
      validationErrors: {},
      isImage: true,
      cyrillic: {
        titleError: false, 
        descrError: false,
      },
      block: {
        title: '',
        link: '',
        image: '',
        description: '',
      },
    }
  },
  validations: {
    block: {
      title: {
        required,
        maxLength: maxLength(20),
      },
      description: {
        required,
        maxLength: maxLength(250),
      },
      link: {
        url,
        required,
      },
    },
  },

  props: {

  },

  created() {
  },
  computed:{
    ...mapGetters({
      blocks: `block/blocks`,
    }),

    titleError() {
      let str = this.block.title
      const ua = /[а-я]+/i.test(str);
      const en = /[a-z]+/i.test(str);
      const error = []
      if (!this.$v.block.title.$dirty) {
        return error
      }
      if (!this.$v.block.title.required) {
        error.push('Будь ласка, заповніть це поле')
      }
      if (!this.$v.block.title.maxLength) {
        error.push('Забагато символів'.replace(':count', 20))
      }
      if (str.length && (!(ua ^ en) || !ua )) {
        error.push('Тільки кирилиця');
        this.cyrillic.titleError = true
      } 
        if (this.validationErrors.title) {
        this.validationErrors.title.forEach((row) => {
          error.push(row)
        })
        this.validationErrors = {}
      }
      return error
    },
    linkError() {
      const error = []
      if (!this.$v.block.link.$dirty) {
        return error
      }
      if (!this.$v.block.link.required) {
        error.push('Будь ласка, заповніть це поле')
      }
      if (!this.$v.block.link.url) {
        error.push('Введіть коректний url')
      }
      if (this.validationErrors.link) {
        this.validationErrors.link.forEach((row) => {
          error.push(row)
        })
        this.validationErrors = {}
      }
      return error
    },
    descriptionError() {
      let str = this.block.description
      const ua = /[а-я]+/i.test(str);
      const en = /[a-z]+/i.test(str);
      const error = []
      if (!this.$v.block.description.$dirty) {
        return error
      }
      if (!this.$v.block.description.required) {
        error.push('Будь ласка, заповніть це поле')
      }
      if (!this.$v.block.description.maxLength) {
        error.push('Забагато символів'.replace(':count', 250))
      }
      if (str.length && (!(ua ^ en) || !ua )) {
        error.push('Тільки кирилиця');
        this.cyrillic.descrError = true
      } 
      if (this.validationErrors.description) {
        this.validationErrors.description.forEach((row) => {
          error.push(row)
        })
        this.validationErrors = {}
      }
      return error
    },
    imageError() {
      const error = []
      if(!this.isImage) {
        error.push('Будь ласка, виберіть зображення')
      } 
      if (this.validationErrors.image) {
        this.validationErrors.image.forEach((row) => {
          error.push(row)
        })
        this.validationErrors = {}
      }
      return error
    },
  },
  watch: {
    'block.title'(newVal) {
      if(newVal){
        if(!this.validationErrors.length && this.cyrillic.titleError) {
          this.cyrillic.titleError = false
        }
        
      }
    },
    'block.description'(newVal) {
      if(newVal){
        if(!this.validationErrors.length && this.cyrillic.descrError) {
          this.cyrillic.descrError = false
        }
        
      }
    }
  },

  mounted() {

  },
  methods:{
    ...mapMutations({
      addBlock: `block/ADD_BLOCK`,
    }),

    saveBlock() {
      this.$v.$touch();
      if (!this.$v.block.$invalid && !this.validationErrors.length && this.block.image.length && !this.cyrillic.titleError && !this.cyrillic.descrError) {
        this.addBlock(this.block)
        this.resetForm()
        this.$refs.form.reset();
        this.$v.$reset()
      } else if(!this.block.image.length) {
        this.isImage = false
      } else {
        this.$toasted.error('Перевірте форму')
      }

    },
    onImg(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      if(file) {
        this.isImage = true
      }
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        this.block.image = base64String;
      };
      reader.readAsDataURL(file);
    },
    resetForm() {
      this.block.title = ''
      this.block.link = ''
      this.block.description = ''
      this.block.image = ''
      this.isImage = true;
    },
  }
  
}
