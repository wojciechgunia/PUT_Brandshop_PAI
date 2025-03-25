package pl.put.brandshop.product.translator;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.product.entity.ProductEntity;
import pl.put.brandshop.product.entity.SimpleProductDTO;

@Mapper
public abstract class ProductEntityToSimpleProduct
{
    public SimpleProductDTO toSimpleProduct(ProductEntity productEntity)
    {
        return toSimpleProductDTO(productEntity);
    }

    @Mappings({
            @Mapping(target = "imageUrl", expression = "java(getImageUrl(productEntity.getImageUrls()))")
    })
    protected abstract SimpleProductDTO toSimpleProductDTO(ProductEntity productEntity);

    String getImageUrl(String[] images)
    {
        return images != null && images.length >=1 ? images[0] : null;
    }
}
