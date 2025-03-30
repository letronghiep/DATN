import { Table } from "antd";
import { useFormContext } from "react-hook-form";
import InputCustom from "../inputs/Input";
import { useEffect, useMemo } from "react";

const SkuTable = () => {
  const { control, watch, setValue } = useFormContext();
  const variations = watch("variations") || [];

  const generateSkuData = () => {
    if (!variations.length) return [];

    const headers = variations.map((v) => v.name).filter(Boolean);
    if (!headers.length) return [];
    
    const combine = (arr1, arr2) =>
      arr1.length === 0
        ? arr2.map((item) => [item])
        : arr1.flatMap((a) => arr2.map((b) => [...a, b]));

    const validVariations = variations.filter(v => v.name && v.options?.length);
    if (!validVariations.length) return [];

    const allCombinations = validVariations.reduce(
      (acc, variation) => combine(acc, variation.options || []),
      []
    );

    return allCombinations.map((combination, index) => {
      const variationObj = {};
      combination.forEach((value, idx) => {
        const variation = validVariations[idx];
        if (variation) {
          variationObj[variation.name] = value;
        }
      });
      return {
        key: index,
        ...variationObj,
        price: "",
        stock: "",
        sku: "",
      };
    });
  };

  // Sử dụng useMemo để cache kết quả của generateSkuData
  const skuData = useMemo(() => generateSkuData(), [variations]);

  // Cập nhật sku_list khi skuData thay đổi
  useEffect(() => {
    if (skuData.length > 0) {
      setValue("sku_list", skuData);
    }
  }, [skuData, setValue]);

  const columns = useMemo(() => [
    ...variations
      .filter(v => v.name)
      .map((variation) => ({
        title: variation.name,
        dataIndex: variation.name,
        key: variation.name,
        render: (value) => {
          const option = variations
            .find(v => v.name === variation.name)
            ?.options?.find(opt => opt === value);
          return option || value;
        }
      })),
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record, index) => (
        <InputCustom
          control={control}
          name={`sku_list.${index}.price`}
          type="number"
        />
      ),
    },
    {
      title: "Kho hàng",
      dataIndex: "stock",
      key: "stock",
      render: (_, record, index) => (
        <InputCustom
          control={control}
          name={`sku_list.${index}.stock`}
          type="number"
        />
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (_, record, index) => (
        <InputCustom control={control} name={`sku_list.${index}.sku`} />
      ),
    },
  ], [variations, control]);

  return skuData.length > 0 ? (
    <Table
      columns={columns}
      dataSource={skuData}
      pagination={false}
      className="mt-4"
    />
  ) : null;
};

export default SkuTable; 