# 滚动至相对高度组件

## 简介
根据传入相对高度，当父级滚动高度不等于相对高度时，点击底部按钮可回到相对高度。（由回到顶部功能拓展形成）

## 用法 
父级需为绝对定位 `position: absolute;`，可传入参数：
```
relativeHeight: number,           // 相对高度
message: string,                  // tootip信息（默认为：回到相对高度）
tipPosition: string               // tootip位置（before：左边,above：上边）
```

使用时需引入 `themeModule`
```
@NgModule({
  imports: [
    ThemeModule,
  ],
})
```
## 详细说明
滚动至相对高度组件位置固定在右下角
1. 当父级内容超出固定高度出现滚动条并且父级滚动高度不等于设定的相对高度时，该组件才会渲染出现。
2. 点击右下角按钮后父级滚动到预设的相对高度位置。
