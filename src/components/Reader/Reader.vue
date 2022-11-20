<template>
  <div class="">
    {{ url }}
  </div>
</template>

<script>
export default {
  name: "PDFReader",
  props: {
    url: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      pdf: undefined,
      pages: [],
      PDF_DOC: "",
    };
  },
  methods: {
    async fetchPDF() {
      import("pdfjs-dist/webpack")
        .then((pdfjs) => pdfjs.getDocument(this.url))
        .then((pdf) => (this.pdf = pdf));
    },
  },
  mounted() {
    this.fetchPDF();
  },
};
</script>
