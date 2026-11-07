const handleTrigger = async (action) => {
    setLoading(true);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // 避免觸發瀏覽器複雜的 preflight 檢查
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      
      if (data.status === 'error') {
        alert('Apps Script 執行出錯：\n' + data.message);
      } else {
        setResultLinks(data);
        alert('自動生成成功！請查看下方產出連結。');
      }
    } catch (e) {
      alert('請求失敗詳細訊息：' + e.message);
    }
    setLoading(false);
  };
