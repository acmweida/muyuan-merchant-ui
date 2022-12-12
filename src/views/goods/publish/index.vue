<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center">
      <el-steps :active="step" finish-status="success" :space="300" style="width: 500px" align-center>
        <el-step title="商品分类信息"/>
        <el-step title="商品基本信息"/>
        <el-step title="商品销售信息"/>
        <el-step title="商品发布"/>
      </el-steps>
    </div>
    <el-divider></el-divider>
    <div v-if="step == 0" style="display: flex;justify-content: center;">
      <el-form ref="categoryForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类目" prop="categoryCode">
          <el-select v-model="form.categoryCode2" placeholder="请选择">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <el-select style="margin-left: 20px;" v-model="form.categoryCode" placeholder="请选择">
            <el-option
              v-for="item in options3th"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId" required>
          <el-select v-model="form.brandId" placeholder="请选择">
            <el-option
              v-for="item in brandOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step == 1" style="display: flex;justify-content: center;">
      <el-form ref="saleForm" :model="form" :rules="rules" label-width="80px" style="width: 50%">
        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入商品名称" style="width: 40%" maxlength="20"/>
        </el-form-item>
        <el-form-item label="销售信息">

        </el-form-item>
        <el-form-item label="销售信息">
          <el-table :header-cell-style="{'text-align':'center'}" :data="skus">
            <el-table-column v-for=" (item,index) of saleAttributes" :prop="item.code" :key="index"
                             :label="item.name">
              <template slot-scope="scope">
                <el-input v-model="scope.row[item.name]"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step == 2">

    </div>

    <div style="display: flex;justify-content: center;">
      <el-button style="margin-top: auto;" @click="next()">确定</el-button>
    </div>

  </div>
</template>

<script>
  import {treeSelect, getCategoryAttribute} from "@/api/goods/category";
  import {options} from "@/api/goods/brand";
  import {deepClone} from '@/utils/index'

  export default {
    data() {
      return {
        step: 0,
        form: {
          categoryCode2: null,
          categoryCode: null,
          brandId: null,
          name: null
        },
        options: [],
        options3th: [],
        brandOption: [],
        rules: {
          categoryCode: [
            {required: true, message: "请选择商品分类", trigger: "blur"}
          ],
          brandId: [
            {required: true, message: "请选择品牌", trigger: "blur"}
          ],
          name: [
            {required: true, message: "请输入商品名称", trigger: "blur"}
          ]
        },
        categoryDetail: {
          attributes: []
        },
        skus: [],
        template: {},
        attributes:[],
        saleAttributes:[]
      }
    },
    created() {
      this.getOption();
    },
    watch: {
      'form.categoryCode2': {
        handler(newValue, oldValue) {
          this.form.categoryCode = null;
          this.getOption3th(newValue);
        }
      },
      'form.categoryCode': {
        handler(newValue, oldValue) {
          if (newValue != null) {
            this.form.brandId = null;
            this.getBlandOptions(newValue);
            this.getCategoryDetail(newValue);
          }
        }
      },
      // 'form.brandId': {
      //   handler(newValue, oldValue) {
      //     this.getCategoryDetail(newValue);
      //   }
      // }
    },
    methods: {
      getOption3th(parentId) {
        treeSelect({parentId: parentId}).then(res => {
          var options = []
          for (var index in res) {
            var temp = {
              label: res[index].label,
              value: res[index].value
            }
            options.push(temp)
          }
          this.options3th = options;
        })
      },
      getOption() {
        treeSelect({level: 1}).then(res => {
          treeSelect({level: 2}).then(res2 => {
            var options = [];
            var map = {};
            for (var index in res) {
              map[res[index].id] = {
                label: res[index].label,
                options: []
              }
            }
            for (var index in res2) {
              map[res2[index].parentId].options.push({
                value: res2[index].id,
                label: res2[index].label
              })
            }
            for (var index in map) {
              var temp = {
                label: map[index].label,
                options: map[index].options
              }
              options.push(temp)
            }
            this.options = options;
          })
        })
      },
      getBlandOptions(categoryCode) {
        options({categoryCode: categoryCode}).then(res => {
          var options = [];
          for (var index in res) {
            options.push({
              value: res[index].id,
              label: res[index].label
            })
          }
          this.brandOption = options;
        })
      },
      getCategoryDetail(categoryCode) {
        getCategoryAttribute(categoryCode).then(res => {
          console.log(res)
          this.categoryDetail = res;
          var saleAttributes = [];

          for (var index in res.attributes) {
            if ((res.attributes[index].type & 2) === 2) {
              saleAttributes.push({
                code: res.attributes[index].code,
                name: res.attributes[index].name
              })
            }
          }
          let size = saleAttributes.length;

          saleAttributes.push({
            code: 'price',
            name: '价格'
          });
          saleAttributes.push({
            code: 'stock',
            name: '库存'
          });

          var skus = [];
          var template = {
            price: null,
            stock: 0,
          }
          for (var index in saleAttributes) {
            template[saleAttributes[index].code] = null
          }
          this.template = template;
          var skuCount = (1 << size);
          for ( var i = 1 ;i <= skuCount;i++) {
            skus.push(deepClone(template));
          }

          console.log(skus)
          this.saleAttributes = saleAttributes
          this.skus = skus;
        })
      },
      next() {
        var formName = 'categoryForm';
        switch (this.step) {
          case 1 :
            formName = 'saleForm';
            break;
          case 2:
            formName = "";
            break;
        }

        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.step++ > 2) {
              this.step = 0;
            }
          }
        });
      }
    }
  }
</script>


<style>
  #header-cell {

  }
</style>
