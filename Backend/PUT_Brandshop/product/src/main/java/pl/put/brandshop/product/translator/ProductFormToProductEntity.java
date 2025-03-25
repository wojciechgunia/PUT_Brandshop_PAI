package pl.put.brandshop.product.translator;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.product.entity.Category;
import pl.put.brandshop.product.entity.ProductEntity;
import pl.put.brandshop.product.entity.ProductFormDTO;

@Mapper
public abstract class ProductFormToProductEntity
{
    public ProductEntity toProductEntity(ProductFormDTO productFormDTO)
    {
        return toEntity(productFormDTO);
    }

    @Mappings({
            @Mapping(target = "category", expression = "java(translate(productFormDTO.getCategory()))")
    })
    protected abstract ProductEntity toEntity(ProductFormDTO productFormDTO);

    protected Category translate(String uid)
    {
        Category category = new Category();
        category.setShortId(uid);
        return category;
    }


}
