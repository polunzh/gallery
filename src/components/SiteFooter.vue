<template>
  <footer class="site-footer">
    <p class="disclaimer">
      本站为个人非盈利项目，所有影视截图版权归原出品方所有。<br>
      如有侵权，请联系删除。
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 48px 40px 40px;
  text-align: center;
}

.disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 2;
  letter-spacing: 0.02em;
}

@media (max-width: 767px) {
  .site-footer {
    padding: 36px 20px 32px;
  }
}
</style>
