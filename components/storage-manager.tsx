"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StorageManager() {
  const clear = () => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("investment-lab-"));
    keys.forEach((key) => localStorage.removeItem(key));
    alert(`${keys.length}개의 저장된 계산기 조건을 삭제했습니다.`);
  };
  return <Button variant="danger" onClick={clear}><Trash2 className="h-4 w-4" />저장된 데이터 전체 삭제</Button>;
}
