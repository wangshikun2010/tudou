function onclick_side(id) {
    if (Old_ID != id)
    {
        document.getElementById(id).style.color = '#7b0f4f';
        var innerHTML_id = document.getElementById(id).innerHTML.split("&nbsp;");
        document.getElementById(id).innerHTML = '<img src="./images/left_jian.png">' + innerHTML_id[2];
        document.getElementById(id).onmouseout=function(){
             this.style.color="#7b0f4f";
        }

        if (typeof(Old_ID)!="undefined")
        {
            var innerHTML_old_id = document.getElementById(Old_ID).innerHTML.split(">");
            document.getElementById(Old_ID).style.color = '#825543';
            document.getElementById(Old_ID).onmouseover=function(){
                 this.style.color="#7b0f4f";
            }
            document.getElementById(Old_ID).onmouseout=function(){
                 this.style.color="#825543";
            }
            document.getElementById(Old_ID).innerHTML = '&nbsp;&nbsp;' + innerHTML_old_id[1];
        }
    }

    Old_ID = id;
}

function onclick_side_main(id)
{
    if (Old_ID != id)
    {
        document.getElementById(id + "_main").style.display = "inline";
        if (typeof(Old_ID)!="undefined")
        {
            document.getElementById(Old_ID + "_main").style.display = "none";
        }
    }

    onclick_side(id);
}

function onclick_store_main(id)
{
    if (Old_ID != id)
    {
        var innerHTML_id = document.getElementById(id).innerHTML.split("&nbsp;");
        document.getElementById("side_main").innerHTML = '              <dl>' +
'                   <dt>　<img src="./images/left_jian.png">　' + innerHTML_id[2] + '</dt>' +
'                   <dd>　</dd>' +
'                   <dd><img src="./images/' + id + '.jpg" alt="店铺展示" class="store_img" /></dd>' +
'               </dl>';
    }

    onclick_side(id);
}
