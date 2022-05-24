class a {
    constructor() {
        console.log(111);
        this.$('.bc').addEventListener('click', this.setData)
        this.getData();
        //删除
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this));
        //给模态框的确认删除按钮绑定事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));
        // this.$('.modify-data').addEventListener('click', this.saveModify.bind(this));
        //修改保存按钮
        this.$('.modify-data').addEventListener('click',this.modifyData.bind(this));
    }
    setData() {
        let form = document.forms[0].elements;
        // console.log(form);
        let name = form.name.value.trim();
        let age = form.age.value.trim();
        let ah = form.ah.value.trim();
        if (!name || !age || !ah) {
            throw new Error('表单不能为空');
        }
        // console.log(name,age,ah);
        axios.post("http://localhost:3000/posts", {
            name,
            age,
            ah
        }).then(res => {
            if (res.status == 201) {
                location.reload();
            }
        });

    }
    getData() {
        //发送请求
        axios.get("http://localhost:3000/posts").then(res => {
            // console.log(res);
            let { data, status } = res;
            let html = ''
            // console.log(data,status);
            data.forEach(ele => {
                // console.log(ele);
                html += `<tr>
                <th scope="row">${ele.id}</th>
                <td>${ele.name}</td>
                <td>${ele.age}</td>
                <td>${ele.ah}</td>
                <td>
                <button type="button" class="btn btn-danger btn-xs btn-del"><span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span></button>
                <button type="button" class="btn btn-warning btn-xs btn-xg"><span class="glyphicon glyphicon-pencil btn-xg" aria-hidden="true"></button>
                </td>
              </tr>`;
                this.$('.table tbody').innerHTML = html;
            });
            // console.log(this.$('.table tbody'));
        })
    }

    //判断点击的是不是删除按钮
    distribute(eve) {
        //利用事件委托获取事件源
        let tar = eve.target;
        // console.log(tar);
        //判断点的是span和button则调用删除方法
        if (tar.classList.contains('btn-del')) this.delData(tar);
        if (tar.classList.contains('btn-xg')) this.xgData(tar)
    };

    //删除的方法
    delData(target) {
        this.target = target;

        // 1 弹出确认删除的模态框,通过js控制
        // $() 是jquery的方法,不是我们封装的那个,不要加this
        $('#delModal').modal('show')
    };
    //确认删除按钮的函数
    confirmDel() {
        //获取id
        let id = 0;
        //确认点击的是span还是button
        if (this.target.nodeName == 'SPAN') {
            let trObj = this.target.parentNode.parentNode.parentNode;
            id = trObj.firstElementChild.innerHTML
        }
        if (this.target.nodeName == 'BUTTON') {
            let trObj = this.target.parentNode.parentNode;
            id = trObj.firstElementChild.innerHTML
        }
        //将id发给json-server服务器,删除对应的数据,刷新页面
        axios.delete('http://localhost:3000/posts/' + id).then(res => {
            if (res.status == 200) {
                location.reload()
            }
        })
    };


    //修改数据
    xgData(target) {
        this.target = target;
        $('#xgModal').modal('show')
        // console.log(111);
        //获取id
        let id = 0;
        let trObj = ''
        //  console.log(target);
        //  确认点击的是span还是button
        if (this.target.nodeName == 'SPAN') {
            trObj = this.target.parentNode.parentNode.parentNode;
            id = trObj.firstElementChild.innerHTML
        }
        if (this.target.nodeName == 'BUTTON') {
            trObj = this.target.parentNode.parentNode;
            id = trObj.firstElementChild.innerHTML
        };
        //  console.log(trObj);
        //  console.log(id);
        // 获取所有的子节点, 分别取出 id idea title pos
        let chil = trObj.children;
        // console.log(chil);
        let title = chil[1].innerHTML;
        let pos = chil[2].innerHTML;
        let idea = chil[3].innerHTML;

        // console.log(id, title, pos, idea);
        // 将内容放到修改表单中
        let form = this.$('#xgModal form').elements;
        // console.log(form);
        form.title.value = title;
        form.idea.value = idea;
        form.pos.value = pos;
        // 将id设置为属性
        this.modifyId = id;
    };
    modifyData(){
        // console.log(111);
        let form = this.$('#xgModal form').elements;
        console.log(form);
        let titval = form.title.value;
        let posval = form.pos.value;
        let ideaval = form.idea.value;
        axios.put("http://localhost:3000/posts/"+this.modifyId,{
            name:titval,
            age : posval,
            ah : ideaval
        }).then(res=>{
            // console.log(res);
            if(res.status == 200){
                location.reload()
            }
        })
    }

    







    //获取节点的方法
    $(ele) {
        let jd = document.querySelectorAll(ele);
        return jd.length == 1 ? jd[0] : jd;
    }

}
new a;