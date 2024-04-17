# Fork of vue-svelte-size-analysis

[Original repo](https://github.com/yyx990803/vue-svelte-size-analysis)

## Gaute's analysis & takeaways

I wanted to add my own comparisons with React, Angular, Solid, and Preact in the mix.

|                 | Vue     | Svelte v4 | Svelte v5 | React   | Angular  | Solid  | Preact | Lit    |
| --------------- | ------- | --------- | --------- | ------- | -------- | ------ | ------ | ------ |
| Component chunk | 1.42kB  | 2.35kB    | 1.50kB    | 1.31kB  | 1.65kB   | 1.59kB | 1.27kB | 1.51kB |
| Vendor chunk    | 18.49kB | 1.80kB    | 5.70kB    | 38.79kB | 44.23kB  | 3.37kB | 6.31kB | 5.52kB |

This was done on versions Vue 3.4.23, Svelte 4.2.15, React 18.2.0, Angular 17.3.5, Solid 1.8.16, Preact 10.20.2, and Lit 3.1.3. 
Note that in newer versions they can make improvements reducing the size or add features growing the size.